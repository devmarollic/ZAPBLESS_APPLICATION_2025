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

export class RabbitMQService extends events.EventEmitter {
    /**
     * Inicializa o serviço RabbitMQ
     * @param {Object} config Configurações
     * @param {string} config.url URL de conexão do RabbitMQ
     * @param {string} config.outboundQueue Nome da fila para consumir
     * @param {string} config.inboundQueue Nome da fila para publicar mensagens recebidas
     * @param {string} config.churchId ID da igreja para filtrar mensagens
     */
    constructor(config = {}) {
        super();
        this.url = config.url;
        this.outboundQueue = config.outboundQueue;
        this.inboundQueue = config.inboundQueue;
        this.disconnectedSessionsQueue
        this.churchId = config.churchId;
        
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
     * Inicia o consumo de mensagens da fila outbound
     * @param {Function} messageHandler Função para processar as mensagens
     * @returns {Promise<void>}
     */
    async consumeMessages(messageHandler) {
        if (!this.connected || !this.channel) {
            throw new Error('Não conectado ao RabbitMQ');
        }
        
        try {
            // Configura o consumo da fila
            await this.channel.consume(this.outboundQueue, async (msg) => {
                if (msg !== null) {
                    try {
                        const content = JSON.parse(msg.content.toString());

                        console.log( JSON.stringify( msg, null, 2 ) );
                        
                        // Verifica se a mensagem é para esta instância (churchId)
                        if (content.churchId === this.churchId) {
                            console.log(`Mensagem recebida para churchId ${this.churchId}:`, content);
                            
                            // Processa a mensagem
                            await messageHandler(content);
                            
                            // Confirma o processamento da mensagem
                            this.channel.ack(msg);
                        } else {
                            // Não é para esta instância, rejeita a mensagem para que seja processada por outra instância
                            this.channel.reject(msg, true);
                        }
                    } catch (error) {
                        console.error('Erro ao processar mensagem:', error);
                        
                        // Rejeita a mensagem em caso de erro
                        this.channel.reject(msg, false);
                    }
                }
            });
            
            console.log(`Consumindo mensagens da fila: ${this.outboundQueue}`);
        } catch (error) {
            console.error('Erro ao consumir mensagens:', error);
            throw error;
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
            // Adiciona o churchId à mensagem
            const messageWithChurchId = {
                ...message,
                churchId: this.churchId
            };
            
            // Converte a mensagem para buffer
            const buffer = Buffer.from(JSON.stringify(messageWithChurchId));
            
            // Publica a mensagem
            await this.channel.sendToQueue(this.inboundQueue, buffer, {
                persistent: true
            });
            
            console.log(`Mensagem publicada na fila ${this.inboundQueue}:`, messageWithChurchId);
            return true;
        } catch (error) {
            console.error('Erro ao publicar mensagem:', error);
            return false;
        }
    }

    /**
     * Publica uma mensagem na fila disconnected sessions
     * @param {Object} reason Razão da desconexão
     * @param {Object} lastDisconnect Última desconexão
     * @returns {Promise<boolean>}
     */
    async publishDisconnectedSession(reason, lastDisconnect) {
        if (!this.connected || !this.channel) {
            throw new Error('Não conectado ao RabbitMQ');
        }
        
        try {
            const messageWithChurchId = {
                reason,
                lastDisconnect,
                churchId: this.churchId
            };
            
            const buffer = Buffer.from(JSON.stringify(messageWithChurchId));
            
            await this.channel.sendToQueue(this.disconnectedSessionsQueue, buffer, {
                persistent: true
            });
            
            console.log(`Mensagem publicada na fila ${this.disconnectedSessionsQueue}:`, messageWithChurchId);
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
            const messageWithChurchId = {
                ...message,
                churchId: this.churchId
            };

            const buffer = Buffer.from(JSON.stringify(messageWithChurchId));

            await this.channel.sendToQueue(this.outboundQueue, buffer, {
                persistent: true
            });

            console.log(`Mensagem publicada na fila ${this.outboundQueue}:`, messageWithChurchId);
            return true;
        } catch (error) {
            console.error('Erro ao publicar mensagem:', error);
            return false;
        }
    }
}