/**
 * WhatsApp Session Manager
 * 
 * Este arquivo fornece uma interface para gerenciar uma sessão do WhatsApp
 * usando diretamente a biblioteca Baileys, sem depender da Evolution API.
 * Ele encapsula as principais funcionalidades como:
 * - Conexão/desconexão
 * - Envio de mensagens
 * - Gerenciamento de sessão
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const events = require('events');
const NodeCache = require('node-cache');
const { getUuidFromText } = require('./utils');
const { contactService } = require('./contact_service');

class WhatsAppManager extends events.EventEmitter {
    /**
     * Inicializa o gerenciador de sessão do WhatsApp
     * @param {Object} config Configurações
     * @param {string} config.sessionDir Diretório para armazenar os dados da sessão
     * @param {string} config.sessionId Identificador único da sessão
     * @param {boolean} config.debug Modo de depuração
     */
    constructor(config = {}) {
        super();
        this.sessionDir = config.sessionDir || './sessions';
        this.sessionId = config.sessionId || 'default-session';
        this.sessionPath = path.join(this.sessionDir, this.sessionId);
        this.debug = config.debug || false;

        // Configuração do logger
        this.logger = pino({
            level: this.debug ? 'debug' : 'info',
            transport: this.debug ? {
                target: 'pino-pretty',
                options: {
                    colorize: true
                }
            } : undefined
        });

        // Cache para mensagens e outros dados
        this.msgRetryCounterCache = new NodeCache();

        // Estado da conexão
        this.state = {
            qr: null,
            connection: 'disconnected',
            lastDisconnect: null
        };

        // Socket do WhatsApp
        this.sock = null;

        // Cria o diretório da sessão se não existir
        if (!fs.existsSync(this.sessionPath)) {
            fs.mkdirSync(this.sessionPath, { recursive: true });
        }
    }

    /**
     * Conecta ao WhatsApp
     * @returns {Promise<boolean>}
     */
    async connect() {
        try {
            // Carrega o estado de autenticação
            const { state, saveCreds } = await useMultiFileAuthState(this.sessionPath);

            // Obtém a versão mais recente do Baileys
            const { version, isLatest } = await fetchLatestBaileysVersion();
            this.logger.info(`Usando WA v${version.join('.')}, é a mais recente: ${isLatest}`);

            // Cria o socket do WhatsApp
            this.sock = makeWASocket({
                version,
                auth: state,
                printQRInTerminal: this.debug,
                logger: this.logger,
                browser: ['ZapBless', 'Chrome', '1.0.0'],
                msgRetryCounterCache: this.msgRetryCounterCache
            });

            // Configura os manipuladores de eventos
            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;

                if (connection === 'close') {
                    let reason = new Boom(lastDisconnect.error).output.statusCode;

                    if (reason === DisconnectReason.badSession) {
                        this.logger.info('Bad Session File, Please Delete and Scan Again');
                    }
                    else if (reason === DisconnectReason.connectionClosed
                        || reason === DisconnectReason.connectionLost
                    ) {
                        await this.connect();
                    }
                    else if (reason === DisconnectReason.connectionReplaced) {
                        this.logger.info('Connection Replaced, Another New Session Opened, Please Close Current Session First');
                    }
                    else if (reason === DisconnectReason.loggedOut) {
                        this.logger.info('Logged Out');
                        this.emit('logout');
                    }
                    else if (reason === DisconnectReason.restartRequired) {
                        this.logger.info('Device Logged Out, Please Login Again');
                    }
                    else if (reason === DisconnectReason.restartRequired) {
                        this.logger.info('Restart Required, Restarting...');
                        await this.connect();
                    }
                    else if (reason === DisconnectReason.timedOut) {
                        this.logger.info('Connection TimedOut, Reconnecting...');
                        await this.connect();
                    }
                    else {
                        this.sock.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);
                    }
                }

                // Atualiza o estado
                if (connection) {
                    this.state.connection = connection;
                    this.logger.info(`Status da conexão: ${connection}`);
                    this.emit('connection', { status: connection });
                }

                // Processa o QR Code
                if (qr) {
                    this.state.qr = qr;
                    if (this.debug) {
                        qrcode.generate(qr, { small: true });
                    }
                    this.emit('qr', qr);
                }
            });

            this.sock.ev.on('messaging-history.set', (data) => {
                const contactData = data.contacts;

                let filteredContactArray = [];

                for (let contact of contactData) {
                    // -- verificação necessário para excluir grupos (@g.us)
                    if (contact.id.endsWith('@s.whatsapp.net')) {
                        let phoneNumberWithPrefix = contact.id.replace(/\D/g, '');

                        filteredContactArray.push({
                            ...contact,
                            number: phoneNumberWithPrefix,
                            churchId: process.env.CHURCH_ID
                        });
                    }
                }

                this.emit('contacts', filteredContactArray);
            });

            this.sock.ev.on('contacts.upsert', async (contacts) => {
                contactService.upsertContact(contacts);
            });

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('messages.upsert', (m) => {
                if (m.type === 'notify') {
                    for (const msg of m.messages) {
                        if (!msg.key.fromMe) {
                            this.emit('message', msg);
                        }
                    }
                }
            });

            return true;
        } catch (error) {
            this.logger.error('Erro ao conectar:', error);
            throw error;
        }
    }

    /**
     * Desconecta do WhatsApp
     * @returns {Promise<boolean>}
     */
    async disconnect() {
        if (!this.sock) return false;

        try {
            await this.sock.logout();
            this.sock = null;
            this.state.connection = 'disconnected';
            this.emit('connection', { status: 'disconnected' });
            return true;
        } catch (error) {
            this.logger.error('Erro ao desconectar:', error);
            return false;
        }
    }

    /**
     * Verifica o estado atual da conexão
     * @returns {Object} Estado da conexão
     */
    getConnectionState() {
        return {
            state: this.state.connection,
            qr: this.state.qr,
            hasSession: fs.existsSync(path.join(this.sessionPath, 'creds.json'))
        };
    }

    /**
     * Envia uma mensagem de texto
     * @param {string} to Número de telefone do destinatário (com código do país)
     * @param {string} text Texto da mensagem
     * @returns {Promise<Object>} Status do envio
     */
    async sendText(to, text) {
        if (!this.sock || this.state.connection !== 'open') {
            throw new Error('WhatsApp não está conectado');
        }

        try {
            // Formata o número para o padrão do WhatsApp
            const jid = this._formatNumber(to);

            // Envia a mensagem
            const result = await this.sock.sendMessage(jid, { text });
            return { status: 'success', messageId: result.key.id };
        } catch (error) {
            this.logger.error('Erro ao enviar mensagem:', error);
            throw error;
        }
    }

    /**
     * Envia uma mensagem de mídia (imagem, vídeo, áudio, documento)
     * @param {string} to Número de telefone do destinatário
     * @param {string} mediaType Tipo de mídia ('image', 'video', 'audio', 'document')
     * @param {string|Buffer} media URL da mídia, caminho do arquivo local ou buffer
     * @param {string} caption Legenda (opcional)
     * @returns {Promise<Object>} Status do envio
     */
    async sendMedia(to, mediaType, media, caption = '') {
        if (!this.sock || this.state.connection !== 'open') {
            throw new Error('WhatsApp não está conectado');
        }

        try {
            // Formata o número para o padrão do WhatsApp
            const jid = this._formatNumber(to);

            // Prepara os dados da mídia
            let mediaData;

            if (typeof media === 'string') {
                if (media.startsWith('http')) {
                    // É uma URL
                    mediaData = { url: media };
                } else if (fs.existsSync(media)) {
                    // É um arquivo local
                    mediaData = fs.readFileSync(media);
                } else {
                    throw new Error('Arquivo não encontrado ou URL inválida');
                }
            } else if (Buffer.isBuffer(media)) {
                // É um buffer
                mediaData = media;
            } else {
                throw new Error('Formato de mídia inválido');
            }

            // Prepara o objeto de mensagem de acordo com o tipo de mídia
            const messageContent = {};

            switch (mediaType.toLowerCase()) {
                case 'image':
                    messageContent.image = mediaData;
                    if (caption) messageContent.caption = caption;
                    break;
                case 'video':
                    messageContent.video = mediaData;
                    if (caption) messageContent.caption = caption;
                    break;
                case 'audio':
                    messageContent.audio = mediaData;
                    // WhatsApp não suporta legenda para áudio
                    break;
                case 'document':
                    messageContent.document = mediaData;
                    if (caption) messageContent.caption = caption;
                    break;
                default:
                    throw new Error(`Tipo de mídia não suportado: ${mediaType}`);
            }

            // Envia a mensagem
            const result = await this.sock.sendMessage(jid, messageContent);
            return { status: 'success', messageId: result.key.id };
        } catch (error) {
            this.logger.error('Erro ao enviar mídia:', error);
            throw error;
        }
    }

    /**
     * Verifica se um número está registrado no WhatsApp
     * @param {string} number Número de telefone (com código do país)
     * @returns {Promise<Object>} Status do número
     */
    async checkNumber(number) {
        if (!this.sock || this.state.connection !== 'open') {
            throw new Error('WhatsApp não está conectado');
        }

        try {
            // Formata o número para o padrão do WhatsApp
            const jid = this._formatNumber(number);

            // Verifica se o número existe no WhatsApp
            const [result] = await this.sock.onWhatsApp(jid);

            return {
                number,
                exists: result ? result.exists : false,
                jid: result ? result.jid : null
            };
        } catch (error) {
            this.logger.error('Erro ao verificar número:', error);
            throw error;
        }
    }

    /**
     * Formata um número para o padrão do WhatsApp
     * @private
     * @param {string} number Número de telefone
     * @returns {string} Número formatado
     */
    _formatNumber(number) {
        // Remove caracteres não numéricos
        let cleaned = number.replace(/\D/g, '');

        // Verifica se já tem o sufixo @s.whatsapp.net
        if (cleaned.endsWith('@s.whatsapp.net')) {
            return cleaned;
        }

        // Adiciona o sufixo @s.whatsapp.net
        return `${cleaned}@s.whatsapp.net`;
    }

    /**
     * Obtém informações do usuário
     * @returns {Promise<Object>} Informações do usuário
     */
    async getUserInfo() {
        if (!this.sock || this.state.connection !== 'open') {
            throw new Error('WhatsApp não está conectado');
        }

        try {
            return this.sock.user;
        } catch (error) {
            this.logger.error('Erro ao obter informações do usuário:', error);
            throw error;
        }
    }

    /**
     * Obtém a foto de perfil de um contato
     * @param {string} number Número de telefone (com código do país)
     * @returns {Promise<Object>} URL da foto de perfil
     */
    async getProfilePicture(number) {
        if (!this.sock || this.state.connection !== 'open') {
            throw new Error('WhatsApp não está conectado');
        }

        try {
            const jid = this._formatNumber(number);
            const ppUrl = await this.sock.profilePictureUrl(jid);
            return { url: ppUrl };
        } catch (error) {
            this.logger.error('Erro ao obter foto de perfil:', error);
            return { url: null, error: error.message };
        }
    }
}

module.exports = WhatsAppManager; 