// -- IMPORTS

import pkg, { DisconnectReason } from '@whiskeysockets/baileys';
const { makeWASocket, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, isJidBroadcast, isJidGroup, proto, isJidNewsletter, BufferJSON } = pkg;
import qrcode from 'qrcode';
import { makeProxyAgent } from './proxy_agent.js';
import { SupabaseRepository } from './supabase_repository.js';
import { useMultiFileAuthStateSupabase } from './use_multi_file_auth_state_supabase.js';
import { release } from 'os';
import axios from 'axios';
import { EventEmitter } from 'events';
import Boom from '@hapi/boom';
import { AuthStateProvider } from './auth_state_provider.js';
import { ProviderFiles } from './provider_file_service.js';
import P from 'pino';
import qrcodeTerminal from 'qrcode-terminal';

// -- CONSTANTS

export const status = {
    0: 'ERROR',
    1: 'PENDING',
    2: 'SERVER_ACK',
    3: 'DELIVERY_ACK',
    4: 'READ',
    5: 'PLAYED',
};

// -- FUNCTIONS

function formatMXOrARNumber(jid) {
    const countryCode = jid.substring(0, 2);

    if (Number(countryCode) === 52 || Number(countryCode) === 54) {
        if (jid.length === 13) {
            const number = countryCode + jid.substring(3);
            return number;
        }

        return jid;
    }
    return jid;
}

function formatBRNumber(jid) {
    const regexp = new RegExp(/^(\d{2})(\d{2})\d{1}(\d{8})$/);
    if (regexp.test(jid)) {
        const match = regexp.exec(jid);
        if (match && match[1] === '55') {
            const joker = Number.parseInt(match[3][0]);
            const ddd = Number.parseInt(match[2]);
            if (joker < 7 || ddd < 31) {
                return match[0];
            }
            return match[1] + match[2] + match[3];
        }
        return jid;
    } else {
        return jid;
    }
}

function createJid(number) {
    number = number.replace(/:\d+/, '');

    if (number.includes('@g.us') || number.includes('@s.whatsapp.net') || number.includes('@lid')) {
        return number;
    }

    if (number.includes('@broadcast')) {
        return number;
    }

    number = number
        ?.replace(/\s/g, '')
        .replace(/\+/g, '')
        .replace(/\(/g, '')
        .replace(/\)/g, '')
        .split(':')[0]
        .split('@')[0];

    if (number.includes('-') && number.length >= 24) {
        number = number.replace(/[^\d-]/g, '');
        return `${number}@g.us`;
    }

    number = number.replace(/\D/g, '');

    if (number.length >= 18) {
        number = number.replace(/[^\d-]/g, '');
        return `${number}@g.us`;
    }

    number = formatMXOrARNumber(number);

    number = formatBRNumber(number);

    return `${number}@s.whatsapp.net`;
}

export const fetchLatestWaWebVersion = async (options) => {
    try {
        const { data } = await axios.get('https://web.whatsapp.com/sw.js', {
            ...options,
            responseType: 'json',
        });

        const regex = /\\?"client_revision\\?":\s*(\d+)/;
        const match = data.match(regex);

        if (!match?.[1]) {
            return {
                version: (await fetchLatestBaileysVersion()).version,
                isLatest: false,
                error: {
                    message: 'Could not find client revision in the fetched content',
                },
            };
        }

        const clientRevision = match[1];

        return {
            version: [2, 3000, +clientRevision],
            isLatest: true,
        };
    } catch (error) {
        return {
            version: (await fetchLatestBaileysVersion()).version,
            isLatest: false,
            error,
        };
    }
};

const Events =
{
    APPLICATION_STARTUP: 'application.startup',
    INSTANCE_CREATE: 'instance.create',
    INSTANCE_DELETE: 'instance.delete',
    QRCODE_UPDATED: 'qrcode.updated',
    CONNECTION_UPDATE: 'connection.update',
    STATUS_INSTANCE: 'status.instance',
    MESSAGES_SET: 'messages.set',
    MESSAGES_UPSERT: 'messages.upsert',
    MESSAGES_EDITED: 'messages.edited',
    MESSAGES_UPDATE: 'messages.update',
    MESSAGES_DELETE: 'messages.delete',
    SEND_MESSAGE: 'send.message',
    SEND_MESSAGE_UPDATE: 'send.message.update',
    CONTACTS_SET: 'contacts.set',
    CONTACTS_UPSERT: 'contacts.upsert',
    CONTACTS_UPDATE: 'contacts.update',
    PRESENCE_UPDATE: 'presence.update',
    CHATS_SET: 'chats.set',
    CHATS_UPDATE: 'chats.update',
    CHATS_UPSERT: 'chats.upsert',
    CHATS_DELETE: 'chats.delete',
    GROUPS_UPSERT: 'groups.upsert',
    GROUPS_UPDATE: 'groups.update',
    GROUP_PARTICIPANTS_UPDATE: 'group-participants.update',
    CALL: 'call',
    TYPEBOT_START: 'typebot.start',
    TYPEBOT_CHANGE_STATUS: 'typebot.change-status',
    LABELS_EDIT: 'labels.edit',
    LABELS_ASSOCIATION: 'labels.association',
    CREDS_UPDATE: 'creds.update',
    MESSAGING_HISTORY_SET: 'messaging-history.set',
    REMOVE_INSTANCE: 'remove.instance',
    LOGOUT_INSTANCE: 'logout.instance',
};

export const delay = (ms) => delayCancellable(ms).delay

export const delayCancellable = (ms) => {
    const stack = new Error().stack
    let timeout, reject;
    const delay = new Promise((resolve, _reject) => {
        timeout = setTimeout(resolve, ms)
        reject = _reject
    })
    const cancel = () => {
        clearTimeout(timeout)
        reject(
            new Boom('Cancelled', {
                statusCode: 500,
                data: {
                    stack
                }
            })
        )
    }

    return { delay, cancel }
}

// -- TYPES

class WhatsAppManager {
    constructor(supabaseRepository, providerFiles) {
        this.eventEmitter = new EventEmitter();
        this.supabaseRepository = supabaseRepository
        this.instance = {};
        this.instance.name = 'WhatsApp';
        this.instance.id = '1';
        this.instance.integration = 'WhatsApp';
        this.instance.number = '5512981606045';
        this.instance.token = '1234567890';
        this.instance.businessId = '1234567890';
        this.instance.qrcode = { count: 0 };

        this.localSettings = {
            groupsIgnore: false,
            syncFullHistory: false,
            alwaysOnline: false,
        };
        this.localProxy = {
            enabled: false,
            host: '',
            port: '',
            protocol: '',
            username: '',
            password: '',
        };
        this.logBaileys = 'error';

        this.authStateProvider = new AuthStateProvider(providerFiles);
    }

    async createClient(number) {
        this.instance.authState = await this.defineAuthState();

        const session = {
            CLIENT: 'ZapBless',
            NAME: 'WhatsApp',
            VERSION: '2.3000.1023204200',
        }

        let browserOptions = {};

        if (number || this.phoneNumber) {
            this.phoneNumber = number;

            console.log(`Phone number: ${number}`);
        } else {
            const browser = [session.CLIENT, session.NAME, release()];
            browserOptions = { browser };

            console.log(`Browser: ${browser}`);
        }

        let version;
        let log;

        if (session.VERSION) {
            version = session.VERSION.split('.');
            log = `Baileys version env: ${version}`;
        } else {
            const baileysVersion = await fetchLatestWaWebVersion({});
            version = baileysVersion.version;
            log = `Baileys version: ${version}`;
        }

        console.log(log);

        console.log(`Group Ignore: ${this.localSettings.groupsIgnore}`);

        let options;

        if (this.localProxy?.enabled) {
            console.log('Proxy enabled: ' + this.localProxy?.host);

            if (this.localProxy?.host?.includes('proxyscrape')) {
                try {
                    const response = await axios.get(this.localProxy?.host);
                    const text = response.data;
                    const proxyUrls = text.split('\r\n');
                    const rand = Math.floor(Math.random() * Math.floor(proxyUrls.length));
                    const proxyUrl = 'http://' + proxyUrls[rand];
                    options = { agent: makeProxyAgent(proxyUrl), fetchAgent: makeProxyAgent(proxyUrl) };
                } catch (error) {
                    this.localProxy.enabled = false;
                }
            } else {
                options = {
                    agent: makeProxyAgent({
                        host: this.localProxy.host,
                        port: this.localProxy.port,
                        protocol: this.localProxy.protocol,
                        username: this.localProxy.username,
                        password: this.localProxy.password,
                    }),
                    fetchAgent: makeProxyAgent({
                        host: this.localProxy.host,
                        port: this.localProxy.port,
                        protocol: this.localProxy.protocol,
                        username: this.localProxy.username,
                        password: this.localProxy.password,
                    }),
                };
            }
        }

        const socketConfig = {
            ...options,
            version,
            logger: P({ level: this.logBaileys }),
            printQRInTerminal: false,
            auth: {
                creds: this.instance.authState.state.creds,
                keys: makeCacheableSignalKeyStore(this.instance.authState.state.keys, P({ level: 'error' })),
            },
            msgRetryCounterCache: this.msgRetryCounterCache,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => (await this.getMessage(key)),
            ...browserOptions,
            markOnlineOnConnect: this.localSettings.alwaysOnline,
            retryRequestDelayMs: 350,
            maxMsgRetryCount: 4,
            fireInitQueries: true,
            connectTimeoutMs: 30_000,
            keepAliveIntervalMs: 30_000,
            qrTimeout: 45_000,
            emitOwnEvents: false,
            shouldIgnoreJid: (jid) => {
                if (this.localSettings.syncFullHistory && isJidGroup(jid)) {
                    return false;
                }

                const isGroupJid = this.localSettings.groupsIgnore && isJidGroup(jid);
                const isBroadcast = !this.localSettings.readStatus && isJidBroadcast(jid);
                const isNewsletter = isJidNewsletter(jid);

                return isGroupJid || isBroadcast || isNewsletter;
            },
            syncFullHistory: this.localSettings.syncFullHistory,
            shouldSyncHistoryMessage: (msg) => {
                return this.historySyncNotification(msg);
            },
            cachedGroupMetadata: this.getGroupMetadataCache,
            userDevicesCache: this.userDevicesCache,
            transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
            patchMessageBeforeSending(message) {
                if (
                    message.deviceSentMessage?.message?.listMessage?.listType === proto.Message.ListMessage.ListType.PRODUCT_LIST
                ) {
                    message = JSON.parse(JSON.stringify(message));

                    message.deviceSentMessage.message.listMessage.listType = proto.Message.ListMessage.ListType.SINGLE_SELECT;
                }

                if (message.listMessage?.listType == proto.Message.ListMessage.ListType.PRODUCT_LIST) {
                    message = JSON.parse(JSON.stringify(message));

                    message.listMessage.listType = proto.Message.ListMessage.ListType.SINGLE_SELECT;
                }

                return message;
            },
        };

        this.endSession = false;

        this.client = makeWASocket(socketConfig);

        if (this.localSettings.wavoipToken && this.localSettings.wavoipToken.length > 0) {
            console.log('useVoiceCallsBaileys', this.localSettings.wavoipToken, this.client, this.connectionStatus.state, true);
            // useVoiceCallsBaileys(this.localSettings.wavoipToken, this.client, this.connectionStatus.state, true);
        }

        this.eventHandler();

        this.client.ws.on('CB:call', (packet) => {
            console.log('CB:call', packet);
            const payload = { event: 'CB:call', packet: packet };
            console.log(Events.CALL, payload, true, ['websocket']);
        });

        this.client.ws.on('CB:ack,class:call', (packet) => {
            console.log('CB:ack,class:call', packet);
            const payload = { event: 'CB:ack,class:call', packet: packet };
            console.log(Events.CALL, payload, true, ['websocket']);
        });

        this.phoneNumber = number;

        return this.client;
    }

    async connectToWhatsapp(number) {
        try {
            return await this.createClient(number);
        } catch (error) {
            console.error(error);
            throw new Error(error?.toString());
        }
    }

    async connectionUpdate({ qr, connection, lastDisconnect }) {
        if (qr) {
            if (this.instance.qrcode.count === 10) {
                console.log(Events.QRCODE_UPDATED, {
                    message: 'QR code limit reached, please login again',
                    statusCode: DisconnectReason.badSession,
                });

                console.log(Events.CONNECTION_UPDATE, {
                    instance: this.instance.name,
                    state: 'refused',
                    statusReason: DisconnectReason.connectionClosed,
                    wuid: this.instance.wuid,
                    profileName: await this.getProfileName(),
                    profilePictureUrl: this.instance.profilePictureUrl,
                });

                this.endSession = true;

                return this.eventEmitter.emit('no.connection', this.instance.name);
            }

            this.instance.qrcode.count++;

            const color = '#000000';
            const optsQrcode =
            {
                margin: 3,
                scale: 4,
                errorCorrectionLevel: 'H',
                color: { light: '#ffffff', dark: color },
            };

            if (this.phoneNumber) {
                await delay(1000);
                this.instance.qrcode.pairingCode = await this.client.requestPairingCode(this.phoneNumber);
            }
            else {
                this.instance.qrcode.pairingCode = null;
            }

            qrcode.toDataURL(qr, optsQrcode, (error, base64) => {
                if (error) {
                    console.error('Qrcode generate failed:' + error.toString());
                    return;
                }

                this.instance.qrcode.base64 = base64;
                this.instance.qrcode.code = qr;

                console.log(Events.QRCODE_UPDATED, {
                    qrcode: { instance: this.instance.name, pairingCode: this.instance.qrcode.pairingCode, code: qr, base64 },
                });
            });

            qrcodeTerminal.generate(qr, { small: true }, (qrcode) =>
                console.log(
                    `\n{ instance: ${this.instance.name} pairingCode: ${this.instance.qrcode.pairingCode}, qrcodeCount: ${this.instance.qrcode.count} }\n` +
                    qrcode,
                ),
            );
        }

        if (connection) {
            this.stateConnection = {
                state: connection,
                statusReason: lastDisconnect?.erro?.output?.statusCode ?? 200,
            };
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const codesToNotReconnect = [DisconnectReason.loggedOut, DisconnectReason.forbidden, 402, 406];
            const shouldReconnect = !codesToNotReconnect.includes(statusCode);

            if (shouldReconnect) {
                await this.connectToWhatsapp(this.phoneNumber);
            } else {
                console.log(Events.STATUS_INSTANCE, {
                    instance: this.instance.name,
                    status: 'closed',
                    disconnectionAt: new Date(),
                    disconnectionReasonCode: statusCode,
                    disconnectionObject: JSON.stringify(lastDisconnect),
                });

                this.eventEmitter.emit('logout.instance', this.instance.name, 'inner');
                this.client?.ws?.close();
                this.client.end(new Error('Close connection'));

                console.log(Events.CONNECTION_UPDATE, { instance: this.instance.name, ...this.stateConnection });
            }
        }

        if (connection === 'open') {
            this.instance.wuid = this.client.user.id.replace(/:\d+/, '');
            try {
                const profilePic = await this.profilePicture(this.instance.wuid);
                this.instance.profilePictureUrl = profilePic.profilePictureUrl;
            } catch (error) {
                this.instance.profilePictureUrl = null;
            }
            const formattedWuid = this.instance.wuid.split('@')[0].padEnd(30, ' ');
            const formattedName = this.instance.name;
            console.log(
                `
              ┌──────────────────────────────┐
              │    CONNECTED TO WHATSAPP     │
              └──────────────────────────────┘`.replace(/^ +/gm, '  '),
            );
            console.log(
                `
              wuid: ${formattedWuid}
              name: ${formattedName}
            `,
            );

            console.log(Events.CONNECTION_UPDATE, {
                instance: this.instance.name,
                wuid: this.instance.wuid,
                profileName: await this.getProfileName(),
                profilePictureUrl: this.instance.profilePictureUrl,
                ...this.stateConnection,
            });
        }

        if (connection === 'connecting') {
            console.log(Events.CONNECTION_UPDATE, { instance: this.instance.name, ...this.stateConnection });
        }
    }

    async profilePicture(number) {
        const jid = createJid(number);

        try {
            const profilePictureUrl = await this.client.profilePictureUrl(jid, 'image');

            return { wuid: jid, profilePictureUrl };
        } catch (error) {
            return { wuid: jid, profilePictureUrl: null };
        }
    }

    async getProfileName() {
        let profileName = this.client.user?.name ?? this.client.user?.verifiedName;
        if (!profileName) {
            const data = await this.supabaseRepository.query(
                'WHATSAPP_SESSION',
                { sessionId: this.instanceId }
            );

            if (data) {
                const creds = JSON.parse(JSON.stringify(data.creds), BufferJSON.reviver);
                profileName = creds.me?.name || creds.me?.verifiedName;
            }
        }

        return profileName;
    }

    async defineAuthState() {
        const db = { SAVE_DATA: { INSTANCE: false } };

        const provider = { ENABLED: true };

        if (provider?.ENABLED) {
            return await this.authStateProvider.authStateProvider(this.instance.id);
        }

        if (db.SAVE_DATA.INSTANCE) {
            return await useMultiFileAuthStateSupabase(this.instance.id, this.cache);
        }
    }

    async getMessage(key, full = false) {
        try {
            const webMessageInfo = (await this.supabaseRepository.query('MESSAGE',
                { instanceId: this.instanceId, id: key.id }));
            if (full) {
                return webMessageInfo[0];
            }
            if (webMessageInfo[0].message?.pollCreationMessage) {
                const messageSecretBase64 = webMessageInfo[0].message?.messageContextInfo?.messageSecret;

                if (typeof messageSecretBase64 === 'string') {
                    const messageSecret = Buffer.from(messageSecretBase64, 'base64');

                    const msg = {
                        messageContextInfo: { messageSecret },
                        pollCreationMessage: webMessageInfo[0].message?.pollCreationMessage,
                    };

                    return msg;
                }
            }

            return webMessageInfo[0].message;
        } catch (error) {
            return { conversation: '' };
        }
    }

    historySyncNotification(msg) {
        return true;
    }

    eventHandler() {
        this.client.ev.process(async (events) => {
            if (!this.endSession) {
                if (events['connection.update']) {
                    this.connectionUpdate(events['connection.update']);
                }

                if (events['creds.update']) {
                    this.instance.authState.saveCreds();
                }
            }
        });
    }

    get qrCode() {
        return {
            pairingCode: this.instance.qrcode?.pairingCode,
            code: this.instance.qrcode?.code,
            base64: this.instance.qrcode?.base64,
            count: this.instance.qrcode?.count
        };
    }
}

// -- STATEMENTS

let providerFiles = new ProviderFiles();
let supabaseRepository = new SupabaseRepository();
let whatsappManager = new WhatsAppManager(
    supabaseRepository,
    providerFiles
);

console.log('Starting WhatsApp Manager test...');
await whatsappManager.connectToWhatsapp('5512981606045'); 