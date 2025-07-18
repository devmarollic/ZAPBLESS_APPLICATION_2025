/**
 * Event Controller para WhatsApp Manager
 * 
 * Gerencia eventos e instâncias do WhatsApp, incluindo monitoramento,
 * limpeza de dados e controle de conexões.
 */

import { EventEmitter } from 'events';
import { rmSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';
import { SupabaseRepository } from './supabase_repository.js';
import { ProviderFiles } from './provider_file_service.js';
import { WhatsAppManager } from './baileys_startup_service.js';
import { clearSession } from './clear_session.js';
import { 
    EVENTS, 
    DEFAULT_CONFIG, 
    CLEANUP_CONFIG,
    getDatabaseConfig,
    getCacheConfig,
    getProviderConfig,
    getChatwootConfig,
    getInstanceTimeout,
    shouldReconnect,
    calculateReconnectDelay,
    getSessionPath,
    getStorePath
} from './event_config.js';

// -- CONSTANTS

// Eventos disponíveis para integração
const INTEGRATION_EVENTS = [
    'APPLICATION_STARTUP',
    'QRCODE_UPDATED',
    'MESSAGES_SET',
    'MESSAGES_UPSERT',
    'MESSAGES_EDITED',
    'MESSAGES_UPDATE',
    'MESSAGES_DELETE',
    'SEND_MESSAGE',
    'SEND_MESSAGE_UPDATE',
    'CONTACTS_SET',
    'CONTACTS_UPSERT',
    'CONTACTS_UPDATE',
    'PRESENCE_UPDATE',
    'CHATS_SET',
    'CHATS_UPSERT',
    'CHATS_UPDATE',
    'CHATS_DELETE',
    'GROUPS_UPSERT',
    'GROUP_UPDATE',
    'GROUP_PARTICIPANTS_UPDATE',
    'CONNECTION_UPDATE',
    'LABELS_EDIT',
    'LABELS_ASSOCIATION',
    'CALL',
    'TYPEBOT_START',
    'TYPEBOT_CHANGE_STATUS',
    'REMOVE_INSTANCE',
    'LOGOUT_INSTANCE',
    'INSTANCE_CREATE',
    'INSTANCE_DELETE',
    'STATUS_INSTANCE',
    'RECONNECT_FAILED',
    'NO_CONNECTION'
];

// -- TYPES

// -- VARIABLES

// -- FUNCTIONS

export class WAMonitoringService {
    constructor(
        eventEmitter,
        supabaseRepository,
        providerFiles
    ) {
        this.eventEmitter = eventEmitter;
        this.supabaseRepository = supabaseRepository;
        this.providerFiles = providerFiles;
        
        // Inicializa configurações
        this.db = getDatabaseConfig();
        this.redis = getCacheConfig();
        this.providerSession = getProviderConfig();
        this.chatwootConfig = getChatwootConfig();
        
        this.logger = console;
        this.waInstances = {};
        
        this.removeInstance();
        this.noConnection();
        this.setupReconnectFailedHandler();
    }

    delInstanceTime(instance) {
        const time = getInstanceTimeout();
        
        if (typeof time === 'number' && time > 0) {
            setTimeout(
                async () => {
                    if (this.waInstances[instance]?.stateConnection?.state !== 'open') {
                        if (this.waInstances[instance]?.stateConnection?.state === 'connecting') {
                            await this.waInstances[instance]?.client?.logout('Log out instance: ' + instance);
                            this.waInstances[instance]?.client?.ws?.close();
                            this.waInstances[instance]?.client?.end(undefined);
                        }
                        this.eventEmitter.emit(EVENTS.REMOVE_INSTANCE, instance, 'inner');
                    }
                },
                1000 * 60 * time,
            );
        }
    }

    async instanceInfo(instanceNames) {
        if (instanceNames && instanceNames.length > 0) {
            const inexistentInstances = instanceNames ? instanceNames.filter((instance) => !this.waInstances[instance]) : [];

            if (inexistentInstances.length > 0) {
                throw new Error(
                    `Instance${inexistentInstances.length > 1 ? 's' : ''} "${inexistentInstances.join(', ')}" not found`,
                );
            }
        }

        const clientName = this.db?.CONNECTION?.CLIENT_NAME || DEFAULT_CONFIG.CLIENT_NAME;

        const where = instanceNames && instanceNames.length > 0
            ? {
                name: {
                    in: instanceNames,
                },
                clientName,
            }
            : { clientName };

        const instances = await this.supabaseRepository.findMany('INSTANCE', {
            where,
            include: {
                Chatwoot: true,
                Proxy: true,
                Rabbitmq: true,
                Nats: true,
                Sqs: true,
                Websocket: true,
                Setting: true,
                _count: {
                    select: {
                        Message: true,
                        Contact: true,
                        Chat: true,
                    },
                },
            },
        });

        return instances;
    }

    async instanceInfoById(instanceId, number) {
        let instanceName;
        
        if (instanceId) {
            const result = await this.supabaseRepository.findFirst('INSTANCE', { where: { id: instanceId } });
            instanceName = result?.name;
            
            if (!instanceName) {
                throw new Error(`Instance "${instanceId}" not found`);
            }
        } else if (number) {
            const result = await this.supabaseRepository.findFirst('INSTANCE', { where: { number } });
            instanceName = result?.name;
            
            if (!instanceName) {
                throw new Error(`Instance "${number}" not found`);
            }
        }

        if (!instanceName) {
            throw new Error(`Instance "${instanceId}" not found`);
        }

        if (instanceName && !this.waInstances[instanceName]) {
            throw new Error(`Instance "${instanceName}" not found`);
        }

        const instanceNames = instanceName ? [instanceName] : null;
        return this.instanceInfo(instanceNames);
    }

    async cleaningUp(instanceName) {
        let instanceDbId;
        
        if (this.db?.SAVE_DATA?.INSTANCE && CLEANUP_CONFIG.ENABLE_DATABASE_CLEANUP) {
            const findInstance = await this.supabaseRepository.findFirst('INSTANCE', {
                where: { name: instanceName },
            });

            if (findInstance) {
                const instance = await this.supabaseRepository.update('INSTANCE', {
                    where: { name: instanceName },
                    data: { connectionStatus: 'close' },
                });

                if (CLEANUP_CONFIG.ENABLE_SESSION_CLEANUP) {
                    const instanceDir = getSessionPath(instance.id);
                    try {
                        rmSync(instanceDir, { recursive: true, force: true });
                    } catch (error) {
                        this.logger.warn(`Erro ao remover diretório da instância: ${error.message}`);
                    }
                }

                instanceDbId = instance.id;
                await this.supabaseRepository.deleteMany('SESSION', { where: { sessionId: instance.id } });
            }
        }

        if (CLEANUP_CONFIG.ENABLE_CACHE_CLEANUP && this.redis?.REDIS?.ENABLED && this.redis?.REDIS?.SAVE_INSTANCES) {
            await this.cache?.delete?.(instanceName);
            if (instanceDbId) {
                await this.cache?.delete?.(instanceDbId);
            }
        }

        if (this.providerSession?.ENABLED) {
            await this.providerFiles.removeSession(instanceName);
        }
    }

    async cleaningStoreData(instanceName) {
        if (CLEANUP_CONFIG.ENABLE_CHATWOOT_CLEANUP && this.chatwootConfig?.ENABLED) {
            const instancePath = getStorePath(`chatwoot/${instanceName}`);
            try {
                execFileSync('rm', ['-rf', instancePath]);
            } catch (error) {
                this.logger.warn(`Erro ao remover dados do Chatwoot: ${error.message}`);
            }
        }

        const instance = await this.supabaseRepository.findFirst('INSTANCE', {
            where: { name: instanceName },
        });

        if (!instance) return;

        if (CLEANUP_CONFIG.ENABLE_SESSION_CLEANUP) {
            const instanceDir = getSessionPath(instance.id);
            try {
                rmSync(instanceDir, { recursive: true, force: true });
            } catch (error) {
                this.logger.warn(`Erro ao remover diretório da instância: ${error.message}`);
            }
        }

        if (CLEANUP_CONFIG.ENABLE_DATABASE_CLEANUP) {
            await this.supabaseRepository.deleteMany('SESSION', { where: { sessionId: instance.id } });
            await this.supabaseRepository.deleteMany('CHAT', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('CONTACT', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('MESSAGE_UPDATE', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('MESSAGE', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('WEBHOOK', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('CHATWOOT', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('PROXY', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('RABBITMQ', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('NATS', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('SQS', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('INTEGRATION_SESSION', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('TYPEBOT', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('WEBSOCKET', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('SETTING', { where: { instanceId: instance.id } });
            await this.supabaseRepository.deleteMany('LABEL', { where: { instanceId: instance.id } });

            await this.supabaseRepository.delete('INSTANCE', { where: { name: instanceName } });
        }
    }

    async loadInstance() {
        try {
            if (this.providerSession?.ENABLED) {
                await this.loadInstancesFromProvider();
            } else if (this.db?.SAVE_DATA?.INSTANCE) {
                await this.loadInstancesFromDatabase();
            } else if (this.redis?.REDIS?.ENABLED && this.redis?.REDIS?.SAVE_INSTANCES) {
                await this.loadInstancesFromRedis();
            }
        } catch (error) {
            this.logger.error('Erro ao carregar instâncias:', error);
        }
    }

    async saveInstance(data) {
        try {
            const clientName = this.db?.CONNECTION?.CLIENT_NAME || DEFAULT_CONFIG.CLIENT_NAME;
            
            await this.supabaseRepository.create('INSTANCE', {
                data: {
                    id: data.instanceId,
                    name: data.instanceName,
                    ownerJid: data.ownerJid,
                    profileName: data.profileName,
                    profilePicUrl: data.profilePicUrl,
                    connectionStatus: data.integration === DEFAULT_CONFIG.INTEGRATION ? 'close' : (data.status ?? 'open'),
                    number: data.number,
                    integration: data.integration || DEFAULT_CONFIG.INTEGRATION,
                    token: data.hash,
                    clientName: clientName,
                    businessId: data.businessId,
                },
            });
        } catch (error) {
            this.logger.error('Erro ao salvar instância:', error);
        }
    }

    deleteInstance(instanceName) {
        try {
            this.eventEmitter.emit(EVENTS.REMOVE_INSTANCE, instanceName, 'inner');
        } catch (error) {
            this.logger.error('Erro ao deletar instância:', error);
        }
    }

    async setInstance(instanceData) {
        const instance = new WhatsAppManager(
            this.supabaseRepository,
            this.providerFiles
        );

        if (!instance) return;

        instance.setInstance({
            instanceId: instanceData.instanceId,
            instanceName: instanceData.instanceName,
            integration: instanceData.integration,
            token: instanceData.token,
            number: instanceData.number,
            businessId: instanceData.businessId,
        });

        await instance.connectToWhatsapp();

        this.waInstances[instanceData.instanceName] = instance;
    }

    async loadInstancesFromRedis() {
        const keys = await this.cache?.keys?.();

        if (keys?.length > 0) {
            await Promise.all(
                keys.map(async (k) => {
                    const instanceData = await this.supabaseRepository.findUnique('INSTANCE', {
                        where: { id: k.split(':')[1] },
                    });

                    if (!instanceData) {
                        return;
                    }

                    const instance = {
                        instanceId: k.split(':')[1],
                        instanceName: k.split(':')[2],
                        integration: instanceData.integration,
                        token: instanceData.token,
                        number: instanceData.number,
                        businessId: instanceData.businessId,
                    };

                    await this.setInstance(instance);
                }),
            );
        }
    }

    async loadInstancesFromDatabase() {
        const clientName = this.db?.CONNECTION?.CLIENT_NAME || DEFAULT_CONFIG.CLIENT_NAME;

        const instances = await this.supabaseRepository.findMany('INSTANCE', {
            where: { clientName: clientName },
        });

        if (instances.length === 0) {
            return;
        }

        await Promise.all(
            instances.map(async (instance) => {
                await this.setInstance({
                    instanceId: instance.id,
                    instanceName: instance.name,
                    integration: instance.integration,
                    token: instance.token,
                    number: instance.number,
                    businessId: instance.businessId,
                });
            }),
        );
    }

    async loadInstancesFromProvider() {
        const instances = await this.providerFiles.allInstances();

        if (!instances?.data) {
            return;
        }

        await Promise.all(
            instances.data.map(async (instanceId) => {
                const instance = await this.supabaseRepository.findUnique('INSTANCE', {
                    where: { id: instanceId },
                });

                if (instance) {
                    await this.setInstance({
                        instanceId: instance.id,
                        instanceName: instance.name,
                        integration: instance.integration,
                        token: instance.token,
                        businessId: instance.businessId,
                    });
                }
            }),
        );
    }

    removeInstance() {
        this.eventEmitter.on(EVENTS.REMOVE_INSTANCE, async (instanceName) => {
            try {
                await this.waInstances[instanceName]?.sendDataWebhook?.(EVENTS.REMOVE_INSTANCE, null);
                await this.cleaningUp(instanceName);
                await this.cleaningStoreData(instanceName);
            } catch (error) {
                this.logger.error('Erro ao remover instância:', error);
            } finally {
                this.logger.warn(`Instance "${instanceName}" - REMOVED`);
            }

            try {
                delete this.waInstances[instanceName];
            } catch (error) {
                this.logger.error('Erro ao deletar instância da memória:', error);
            }
        });

        this.eventEmitter.on(EVENTS.LOGOUT_INSTANCE, async (instanceName) => {
            try {
                await this.waInstances[instanceName]?.sendDataWebhook?.(EVENTS.LOGOUT_INSTANCE, null);

                if (this.chatwootConfig?.ENABLED) {
                    this.waInstances[instanceName]?.clearCacheChatwoot?.();
                }

                await this.cleaningUp(instanceName);
            } catch (error) {
                this.logger.error('Erro no logout da instância:', error);
            } finally {
                this.logger.warn(`Instance "${instanceName}" - LOGOUT`);
            }
        });
    }

    noConnection() {
        this.eventEmitter.on(EVENTS.NO_CONNECTION, async (instanceName) => {
            try {
                await this.waInstances[instanceName]?.client?.logout('Log out instance: ' + instanceName);
                this.waInstances[instanceName]?.client?.ws?.close();
                this.waInstances[instanceName].instance.qrcode = { count: 0 };
                this.waInstances[instanceName].stateConnection.state = 'close';
            } catch (error) {
                this.logger.error({
                    localError: 'noConnection',
                    warn: 'Error deleting instance from memory.',
                    error,
                });
            } finally {
                this.logger.warn(`Instance "${instanceName}" - NOT CONNECTION`);
            }
        });
    }

    setupReconnectFailedHandler() {
        this.eventEmitter.on(EVENTS.RECONNECT_FAILED, async (instanceName) => {
            try {
                this.logger.error(`Reconexão falhou para a instância: ${instanceName}`);
                
                // Aqui você pode implementar notificações ou ações específicas
                // como enviar alerta para administradores, etc.
                
                // Opcional: tentar limpar a sessão e recriar
                await clearSession(process.env.CHURCH_ID);
                
            } catch (error) {
                this.logger.error('Erro ao tratar falha de reconexão:', error);
            }
        });
    }
}

/**
 * Event Controller para integrações
 * 
 * Gerencia eventos específicos de integração como webhooks, APIs, etc.
 */
export class EventController {
    constructor(
        supabaseRepository,
        waMonitor,
        integrationStatus,
        integrationName
    ) {
        this.supabaseRepository = supabaseRepository;
        this.waMonitor = waMonitor;
        this.integrationStatus = integrationStatus;
        this.integrationName = integrationName;
    }

    get prisma() {
        return this.supabaseRepository;
    }

    set prisma(repository) {
        this.supabaseRepository = repository;
    }

    get monitor() {
        return this.waMonitor;
    }

    set monitor(waMonitor) {
        this.waMonitor = waMonitor;
    }

    get name() {
        return this.integrationName;
    }

    set name(name) {
        this.integrationName = name;
    }

    get status() {
        return this.integrationStatus;
    }

    set status(status) {
        this.integrationStatus = status;
    }

    async set(instanceName, data) {
        if (!this.status) {
            return;
        }

        if (!data[this.name]?.enabled) {
            data[this.name].events = [];
        } else {
            if (0 === data[this.name].events.length) {
                data[this.name].events = INTEGRATION_EVENTS;
            }
        }

        const instanceId = this.monitor.waInstances[instanceName]?.instanceId;
        if (!instanceId) {
            throw new Error(`Instância ${instanceName} não encontrada`);
        }

        return this.supabaseRepository.upsert(this.name, {
            where: {
                instanceId: instanceId,
            },
            update: {
                enabled: data[this.name]?.enabled,
                events: data[this.name].events,
            },
            create: {
                enabled: data[this.name]?.enabled,
                events: data[this.name].events,
                instanceId: instanceId,
            },
        });
    }

    async get(instanceName) {
        if (!this.status) {
            return;
        }

        if (undefined === this.monitor.waInstances[instanceName]) {
            return null;
        }

        const instanceId = this.monitor.waInstances[instanceName].instanceId;
        const data = await this.supabaseRepository.findUnique(this.name, {
            where: {
                instanceId: instanceId,
            },
        });

        if (!data) {
            return null;
        }

        return data;
    }

    static get events() {
        return INTEGRATION_EVENTS;
    }
}

/**
 * Função para emitir eventos para integrações
 */
export async function emitEvent(emitData) {
    const {
        instanceName,
        origin,
        event,
        data,
        serverUrl,
        dateTime,
        sender,
        apiKey,
        local,
        integration
    } = emitData;

    try {
        // Se é local, apenas emite o evento internamente
        if (local) {
            return;
        }

        // Verifica se a integração está habilitada
        if (!integration || integration.length === 0) {
            return;
        }

        // Emite o evento para cada integração
        for (const integrationName of integration) {
            const payload = {
                instanceName,
                origin,
                event,
                data,
                serverUrl,
                dateTime,
                sender,
                apiKey
            };

            // Aqui você pode implementar a lógica específica para cada integração
            // Por exemplo: webhook, API, etc.
            console.log(`Emitindo evento ${event} para integração ${integrationName}:`, payload);
        }

    } catch (error) {
        console.error('Erro ao emitir evento:', error);
    }
}
