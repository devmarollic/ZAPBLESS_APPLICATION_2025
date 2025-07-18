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

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const events = require('events');
const NodeCache = require('node-cache');
const { getRandomTuid, getTuidFromText, sleep } = require('./utils');
const { contactService } = require('./contact_service');
const { whatsappService } = require('./whatsapp_service');
const { getConnectionConfig, shouldReconnect, calculateReconnectDelay, validateNetworkConfig } = require('./connection_config');
const { CHURCH_ID } = require('./enviroment');
const churchId = process.env.CHURCH_ID;

class WhatsappSessionMapper {
    static toDomain(
        whatsapp
    ) {
        return (
            {
                id: whatsapp?.id,
                churchId: whatsapp?.churchId ?? process.env.CHURCH_ID,
                name: whatsapp?.name ?? process.env.CHURCH_NAME,
                connection: whatsapp?.status ?? 'disconnected',
                qr: whatsapp?.qrcode ?? null,
                retries: whatsapp?.retries ?? 0,
                battery: whatsapp?.battery ?? 0,
                isPlugged: whatsapp?.isPlugged ?? false,
                greetingMessage: whatsapp?.greetingMessage ?? null,
                farewellsMessage: whatsapp?.farewellsMessage ?? null,
                isDefault: whatsapp?.isDefault ?? false,
                lastDisconnect: null
            }
        );
    }

    static toPersistence(
        whatsapp
    ) {
        return (
            {
                id: getRandomTuid(),
                churchId: whatsapp.churchId,
                name: whatsapp.name,
                status: whatsapp.connection ?? 'disconnected',
                qrcode: whatsapp.qr,
                retries: whatsapp.retries,
                battery: whatsapp.battery,
                isPlugged: whatsapp.isPlugged,
                greetingMessage: whatsapp.greetingMessage,
                farewellsMessage: whatsapp.farewellsMessage,
                isDefault: whatsapp.isDefault
            }
        );
    }
}

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
        this.state = WhatsappSessionMapper.toDomain(config.whatsapp);

        // Socket do WhatsApp
        this.sock = null;

        // Controle de reconexão
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.isReconnecting = false;

        // Controle de pairing code
        this.pendingPhoneNumber = null;

        // Cria o diretório da sessão se não existir
        if (!fs.existsSync(this.sessionPath)) {
            fs.mkdirSync(this.sessionPath, { recursive: true });
        }
    }

    /**
     * Conecta ao WhatsApp
     * @param {string} phoneNumber Número de telefone para pairing code (opcional)
     * @returns {Promise<boolean>}
     */
    async connect(phoneNumber = null) {
        try {
            // Valida configurações de rede antes de conectar
            const networkValidation = await validateNetworkConfig();
            if (!networkValidation.success) {
                this.logger.warn('Problemas de rede detectados:', networkValidation.issues);
            }

            // Carrega o estado de autenticação
            const { state, saveCreds } = await useMultiFileAuthState(this.sessionPath);

            // Obtém a versão mais recente do Baileys
            const { version, isLatest } = await fetchLatestBaileysVersion();
            this.logger.info(`Usando WA v${version.join('.')}, é a mais recente: ${isLatest}`);

            // Obtém configurações de conexão
            const connectionConfig = getConnectionConfig(this.logger);

            // Cria o socket do WhatsApp com configurações melhoradas
            this.sock = makeWASocket({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, this.logger),
                },
                printQRInTerminal: this.debug,
                logger: this.logger,
                msgRetryCounterCache: this.msgRetryCounterCache,
                // Configurações de conexão
                connectTimeoutMs: connectionConfig.connectTimeoutMs,
                qrTimeout: connectionConfig.qrTimeout,
                keepAliveIntervalMs: connectionConfig.keepAliveIntervalMs,
                retryRequestDelayMs: connectionConfig.retryRequestDelayMs,
                // Configurações de user agent
                browser: connectionConfig.browser,
                // Configurações de proxy (se configurado)
                ...(connectionConfig.agent && { agent: connectionConfig.agent }),
                ...(connectionConfig.fetchAgent && { fetchAgent: connectionConfig.fetchAgent }),
            });

            // Armazena o número de telefone para pairing code se fornecido
            this.pendingPhoneNumber = phoneNumber;

            // Configura os manipuladores de eventos
            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;

                if (qr) {
                    this.state.qr = qr;
                    if (this.debug) {
                        qrcode.generate(qr, { small: true });
                    }
                    this.emit('qr', qr);

                    if (phoneNumber && connection == "connecting" ) {
                        this.state.pairingCode = await this.sock.requestPairingCode('5512981606045');
                    }
                    else {
                        this.pendingPhoneNumber = null;
                    }
                }

                if (connection === 'close') {
                    const statusCode = (lastDisconnect?.error)?.output?.statusCode;
                    const codesToNotReconnect = [DisconnectReason.loggedOut, DisconnectReason.forbidden, 402, 406];
                    const shouldReconnect = !codesToNotReconnect.includes(statusCode);
                    if (shouldReconnect) {
                        await this.connect(this.pendingPhoneNumber);
                    } else {
                        // await this.prismaRepository.instance.update({
                        //     where: { id: this.instanceId },
                        //     data: {
                        //         connectionStatus: 'close',
                        //         disconnectionAt: new Date(),
                        //         disconnectionReasonCode: statusCode,
                        //         disconnectionObject: JSON.stringify(lastDisconnect),
                        //     },
                        // });
                        this.emit('logout.instance', CHURCH_ID, 'inner');
                        this.sock?.ws?.close();
                        this.sock.end(new Error('Close connection'));
                    }
                }

                // Atualiza o estado
                if (connection) {
                    this.state.connection = connection;
                    this.logger.info(`Status da conexão: ${connection}`);
                    this.emit('connection', { status: connection });
                }

                // await whatsappService.upsertWhatsapp(
                //     WhatsappSessionMapper.toPersistence(
                //         {
                //             ...this.state,
                //             connection,
                //             qr,
                //             lastDisconnect: null
                //         }
                //     )
                // );
            });

            this.sock.ev.on('messaging-history.set', async (data) => {
                const contactData = data.contacts;

                let filteredContactArray = [];

                for (let contact of contactData) {
                    // -- verificação necessário para excluir grupos (@g.us)
                    if (contact.id.endsWith('@s.whatsapp.net') && contact.id !== '0@s.whatsapp.net') {
                        let phoneNumberWithPrefix = contact.id.replace(/\D/g, '');

                        // Tenta obter a foto de perfil
                        let profilePicture = null;
                        try {
                            profilePicture = await this.sock.profilePictureUrl(contact.id, 'image');
                        } catch (error) {
                            // Foto de perfil não disponível, continua sem ela
                        }

                        filteredContactArray.push({
                            name: [contact.name, contact.notify, contact.verifiedName].filter(Boolean)?.[0],
                            id: getTuidFromText(contact.id + churchId),
                            number: phoneNumberWithPrefix,
                            churchId: process.env.CHURCH_ID,
                            imgUrl: profilePicture,
                            status: 'active'
                        });
                    }
                }

                this.emit('contacts', filteredContactArray);
            });

            this.sock.ev.on('contacts.upsert', async (contacts) => {
                for (let contact of contacts) {
                    if (contact.id
                        && contact.id.endsWith('@s.whatsapp.net')
                        && contact.id !== '0@s.whatsapp.net'
                    ) {
                        let phoneNumberWithPrefix = contact.id.replace(/\D/g, '');

                        // Tenta obter a foto de perfil
                        let profilePicture = null;

                        try {
                            profilePicture = await this.sock.profilePictureUrl(contact.id, 'image');
                        } catch (error) {
                            // Foto de perfil não disponível, continua sem ela
                        }

                        contactService.upsertContact(
                            {
                                name: [contact.name, contact.notify, contact.verifiedName].filter(Boolean)?.[0],
                                id: getTuidFromText(contact.id + churchId),
                                number: phoneNumberWithPrefix,
                                churchId: process.env.CHURCH_ID,
                                imgUrl: profilePicture,
                                status: 'active'
                            }
                        );
                    }
                }
            });

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('messages.upsert', (message) => {
                if (message.type === 'notify') {
                    for (const message_ of message.messages) {
                        if (!message_.key.fromMe) {
                            this.emit('message', message_);
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
     * Solicita pairing code com retry e backoff
     * @param {string} phoneNumber - Número de telefone
     * @returns {Promise<void>}
     */
    async requestPairingCodeWithRetry(phoneNumber) {
        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                // Verifica se a conexão está pronta
                if (!this.sock || this.state.connection !== 'connecting') {
                    this.logger.warn('Conexão não está pronta para pairing code, aguardando...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    retryCount++;
                    continue;
                }

                this.logger.info(`Solicitando pairing code para ${phoneNumber} (tentativa ${retryCount + 1})`);
                await sleep(1000);
                const pairingCode = await this.sock.requestPairingCode(phoneNumber);

                this.emit('pairingCode', pairingCode);
                this.logger.info(`Pairing code gerado para ${phoneNumber}: ${pairingCode}`);
                return pairingCode;

            } catch (error) {
                retryCount++;
                this.logger.error(`Erro ao gerar pairing code (tentativa ${retryCount}):`, error.message);

                if (retryCount >= maxRetries) {
                    this.logger.error('Máximo de tentativas para pairing code atingido');
                    this.emit('pairingCodeError', { error, phoneNumber });
                    throw error;
                }

                // Aguarda antes da próxima tentativa com backoff exponencial
                const delay = Math.min(2000 * Math.pow(2, retryCount - 1), 10000);
                this.logger.info(`Aguardando ${delay}ms antes da próxima tentativa...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    /**
     * Tenta reconectar com backoff exponencial
     * @returns {Promise<void>}
     */
    async attemptReconnect() {
        if (this.isReconnecting) {
            this.logger.info('Reconexão já em andamento, ignorando...');
            return;
        }

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.logger.error(`Máximo de tentativas de reconexão atingido (${this.maxReconnectAttempts})`);
            this.emit('reconnectFailed', { attempts: this.reconnectAttempts });
            return;
        }

        this.isReconnecting = true;
        this.reconnectAttempts++;

        const delay = calculateReconnectDelay(this.reconnectAttempts);
        this.logger.info(`Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts} em ${delay}ms`);

        setTimeout(async () => {
            try {
                await this.connect();
                this.logger.info('Reconexão bem-sucedida');
                this.reconnectAttempts = 0;
                this.emit('reconnected');
            } catch (error) {
                this.logger.error(`Erro na reconexão (tentativa ${this.reconnectAttempts}):`, error.message);
                this.attemptReconnect();
            } finally {
                this.isReconnecting = false;
            }
        }, delay);
    }

    /**
     * Solicita pairing code para um número específico
     * @param {string} phoneNumber - Número de telefone
     * @returns {Promise<string>} - Código de pareamento
     */
    async requestPairingCode(phoneNumber) {
        if (!phoneNumber) {
            throw new Error('Número de telefone é obrigatório');
        }

        // Formata o número
        const formattedNumber = this._formatNumber(phoneNumber);

        // Verifica se a conexão está pronta
        if (this.state.connection === 'open') {
            return await this.requestPairingCodeWithRetry(formattedNumber);
        } else {
            // Armazena para solicitar quando a conexão estiver pronta
            this.pendingPhoneNumber = formattedNumber;
            this.logger.info(`Número ${formattedNumber} armazenado para pairing code quando conexão estiver pronta`);
            return null;
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

            await whatsappService.upsertWhatsapp(
                WhatsappSessionMapper.toPersistence(
                    this.state,
                )
            );

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
            const ppUrl = await this.sock.profilePictureUrl(jid, 'image');
            return { url: ppUrl };
        } catch (error) {
            this.logger.error('Erro ao obter foto de perfil:', error);
            return { url: null, error: error.message };
        }
    }

    // ~~

    async presenceSubscribe(number) {
        if (!this.sock || this.state.connection !== 'open') {
            throw new Error('WhatsApp não está conectado');
        }

        const jid = this._formatNumber(number);
        await this.sock.presenceSubscribe(jid);
    }

    // ~~

    async sendPresenceUpdate(status, number) {
        if (!this.sock || this.state.connection !== 'open') {
            throw new Error('WhatsApp não está conectado');
        }

        const jid = this._formatNumber(number);
        await this.sock.sendPresenceUpdate(status, jid);
    }

    // ~~


}

module.exports = WhatsAppManager; 