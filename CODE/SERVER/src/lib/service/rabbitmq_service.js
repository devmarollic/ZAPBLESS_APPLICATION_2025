/**
 * RabbitMQ Service
 * 
 * Este serviço gerencia a conexão com o RabbitMQ e o consumo de mensagens
 * do tópico outbound para processamento de mensagens do WhatsApp.
 */

import events from 'events';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const amqp = require('amqplib');

class RabbitMQService extends events.EventEmitter {
    /**
     * Inicializa o serviço RabbitMQ
     * @param {Object} config Configurações
     * @param {string} config.url URL de conexão do RabbitMQ
     * @param {string} config.outboundQueue Nome da fila para consumir
     * @param {string} config.inboundQueue Nome da fila para publicar mensagens recebidas
     */
    constructor(config = {}) {
        super();
        this.url = config.url || 'amqp://localhost';
        this.outboundQueue = config.outboundQueue || 'zapbless.outbound';
        this.inboundQueue = config.inboundQueue || 'zapbless.inbound';
        this.disconnectedSessionsQueue
        
        this.connection = null;
        this.channel = null;
        this.connected = false;
    }

    /**
     * Conecta ao servidor RabbitMQ
     * @returns {Promise<boolean>}
     */
    async connect() {
        try {
            this.connection = await amqp.connect(this.url);
            
            this.connection.on('error', (err) => {
                console.error('Erro na conexão RabbitMQ:', err);
                this.connected = false;
                this.emit('error', err);
                
                // Tenta reconectar após um tempo
                setTimeout(() => this.reconnect(), 5000);
            });
            
            this.connection.on('close', () => {
                console.log('Conexão RabbitMQ fechada');
                this.connected = false;
                
                // Tenta reconectar após um tempo
                setTimeout(() => this.reconnect(), 5000);
            });
            
            // Cria um canal
            this.channel = await this.connection.createChannel();
            
            // Garante que as filas existem
            await this.channel.assertQueue(this.outboundQueue, {
                durable: true
            });
            
            await this.channel.assertQueue(this.inboundQueue, {
                durable: true
            });
            
            this.connected = true;
            console.log(`Conectado ao RabbitMQ: ${this.url}`);
            this.emit('connected');
            
            return true;
        } catch (error) {
            console.error('Erro ao conectar ao RabbitMQ:', error);
            this.connected = false;
            this.emit('error', error);
            
            // Tenta reconectar após um tempo
            setTimeout(() => this.reconnect(), 5000);
            
            return false;
        }
    }
    
    /**
     * Tenta reconectar ao RabbitMQ
     * @private
     */
    async reconnect() {
        if (!this.connected) {
            console.log('Tentando reconectar ao RabbitMQ...');
            await this.connect();
        }
    }

    /**
     * Publica uma mensagem na fila inbound
     * @param {Object} message Mensagem a ser publicada
     * @returns {Promise<boolean>}
     */
    async publishInboundMessage(message) {
        if (!this.connected || !this.channel) {
            throw new Error('Não conectado ao RabbitMQ');
        }
        
        try {
            // Converte a mensagem para buffer
            const buffer = Buffer.from(JSON.stringify(message));
            
            // Publica a mensagem
            await this.channel.sendToQueue(this.inboundQueue, buffer, {
                persistent: true
            });
            
            console.log(`Mensagem publicada na fila ${this.inboundQueue}:`, message);
            return true;
        } catch (error) {
            console.error('Erro ao publicar mensagem:', error);
            return false;
        }
    }

    /**
     * Fecha a conexão com o RabbitMQ
     * @returns {Promise<void>}
     */
    async close() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            
            if (this.connection) {
                await this.connection.close();
            }
            
            this.connected = false;
            console.log('Conexão RabbitMQ fechada');
        } catch (error) {
            console.error('Erro ao fechar conexão RabbitMQ:', error);
        }
    }

    async publishOutboundMessage(message) {
        if (!this.connected || !this.channel) {
            throw new Error('Não conectado ao RabbitMQ');
        }
        
        try {
            const buffer = Buffer.from(JSON.stringify(message));

            await this.channel.sendToQueue(this.outboundQueue, buffer, {
                persistent: true
            });

            console.log(`Mensagem publicada na fila ${this.outboundQueue}:`, message);
            return true;
        } catch (error) {
            console.error('Erro ao publicar mensagem:', error);
            return false;
        }
    }
}

// -- VARIABLES

export let rabbitmqService = new RabbitMQService(
    {
        url: process.env.RABBITMQ_URL,
        outboundQueue: process.env.RABBITMQ_OUTBOUND_QUEUE,
        inboundQueue: process.env.RABBITMQ_INBOUND_QUEUE
    }
    );