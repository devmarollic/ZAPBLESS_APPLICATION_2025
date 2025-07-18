/**
 * Exemplo de uso do Event Controller para o projeto WhatsApp
 * 
 * Demonstra como integrar o WAMonitoringService e EventController
 * no servidor WhatsApp existente.
 */

import { EventEmitter } from 'events';
import { WAMonitoringService, EventController, emitEvent } from './event_controller.js';
import { SupabaseRepository } from './supabase_repository.js';
import { ProviderFiles } from './provider_file_service.js';
import { EVENTS, DEFAULT_CONFIG } from './event_config.js';

// -- CONSTANTS

// -- TYPES

// -- VARIABLES

// -- FUNCTIONS

/**
 * Configura o Event Controller para o servidor WhatsApp
 */
async function setupEventControllerForWhatsApp() {
    console.log('🔧 Configurando Event Controller para WhatsApp...');

    // Cria o event emitter principal
    const eventEmitter = new EventEmitter();
    
    // Configurações específicas para o projeto WhatsApp
    const configService = {
        get: (key) => {
            const configs = {
                'DATABASE': {
                    SAVE_DATA: { INSTANCE: true },
                    CONNECTION: { CLIENT_NAME: DEFAULT_CONFIG.CLIENT_NAME }
                },
                'CACHE': {
                    REDIS: { ENABLED: false, SAVE_INSTANCES: false }
                },
                'PROVIDER': { ENABLED: false },
                'CHATWOOT': { ENABLED: false },
                'DEL_INSTANCE': 60
            };
            return configs[key];
        }
    };

    // Inicializa repositórios
    const supabaseRepository = new SupabaseRepository();
    const providerFiles = new ProviderFiles();
    
    // Cache services mock (implemente conforme necessário)
    const cache = {
        delete: async (key) => console.log(`Cache delete: ${key}`),
        keys: async () => []
    };
    
    const chatwootCache = { ...cache };
    const baileysCache = { ...cache };

    // Cria o monitoring service
    const monitoringService = new WAMonitoringService(
        eventEmitter,
        configService,
        supabaseRepository,
        providerFiles,
        cache,
        chatwootCache,
        baileysCache
    );

    // Cria o event controller para integrações
    const eventController = new EventController(
        supabaseRepository,
        monitoringService,
        true, // integrationStatus
        'webhook' // integrationName
    );

    // Configura event listeners específicos para WhatsApp
    setupWhatsAppEventListeners(eventEmitter, monitoringService, eventController);

    console.log('✅ Event Controller configurado para WhatsApp');
    
    return { eventEmitter, monitoringService, eventController };
}

/**
 * Configura event listeners específicos para WhatsApp
 */
function setupWhatsAppEventListeners(eventEmitter, monitoringService, eventController) {
    // Listener para reconexão falhada
    eventEmitter.on(EVENTS.RECONNECT_FAILED, async (instanceName) => {
        console.log(`🚨 Reconexão falhou para: ${instanceName}`);
        
        try {
            // Emite evento para integrações
            await emitEvent({
                instanceName,
                origin: 'whatsapp',
                event: 'RECONNECT_FAILED',
                data: { instanceName, timestamp: new Date().toISOString() },
                serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
                dateTime: new Date().toISOString(),
                sender: 'whatsapp-manager',
                local: false,
                integration: ['webhook', 'email']
            });
            
            // Tenta limpeza e recuperação
            await monitoringService.cleaningUp(instanceName);
            
        } catch (error) {
            console.error('Erro ao tratar falha de reconexão:', error);
        }
    });

    // Listener para logout de instância
    eventEmitter.on(EVENTS.LOGOUT_INSTANCE, async (instanceName, reason) => {
        console.log(`🚪 Logout da instância: ${instanceName}, motivo: ${reason}`);
        
        try {
            await emitEvent({
                instanceName,
                origin: 'whatsapp',
                event: 'LOGOUT_INSTANCE',
                data: { instanceName, reason, timestamp: new Date().toISOString() },
                serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
                dateTime: new Date().toISOString(),
                sender: 'whatsapp-manager',
                local: false,
                integration: ['webhook']
            });
        } catch (error) {
            console.error('Erro ao processar logout:', error);
        }
    });

    // Listener para remoção de instância
    eventEmitter.on(EVENTS.REMOVE_INSTANCE, async (instanceName, reason) => {
        console.log(`🗑️ Instância removida: ${instanceName}, motivo: ${reason}`);
        
        try {
            await emitEvent({
                instanceName,
                origin: 'whatsapp',
                event: 'REMOVE_INSTANCE',
                data: { instanceName, reason, timestamp: new Date().toISOString() },
                serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
                dateTime: new Date().toISOString(),
                sender: 'whatsapp-manager',
                local: false,
                integration: ['webhook']
            });
        } catch (error) {
            console.error('Erro ao processar remoção:', error);
        }
    });

    // Listener para sem conexão
    eventEmitter.on(EVENTS.NO_CONNECTION, async (instanceName) => {
        console.log(`❌ Sem conexão para: ${instanceName}`);
        
        try {
            await emitEvent({
                instanceName,
                origin: 'whatsapp',
                event: 'NO_CONNECTION',
                data: { instanceName, timestamp: new Date().toISOString() },
                serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
                dateTime: new Date().toISOString(),
                sender: 'whatsapp-manager',
                local: false,
                integration: ['webhook']
            });
        } catch (error) {
            console.error('Erro ao processar falta de conexão:', error);
        }
    });

    // Listener para atualização de conexão
    eventEmitter.on(EVENTS.CONNECTION_UPDATE, async (data) => {
        console.log(`📡 Status da conexão: ${data.state}`);
        
        try {
            await emitEvent({
                instanceName: data.instance || 'ZapBless',
                origin: 'whatsapp',
                event: 'CONNECTION_UPDATE',
                data: { ...data, timestamp: new Date().toISOString() },
                serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
                dateTime: new Date().toISOString(),
                sender: 'whatsapp-manager',
                local: false,
                integration: ['webhook']
            });
        } catch (error) {
            console.error('Erro ao processar atualização de conexão:', error);
        }
    });

    // Listener para QR Code atualizado
    eventEmitter.on(EVENTS.QRCODE_UPDATED, async (data) => {
        console.log(`📱 QR Code gerado para: ${data.qrcode?.instance}`);
        
        try {
            await emitEvent({
                instanceName: data.qrcode?.instance || 'ZapBless',
                origin: 'whatsapp',
                event: 'QRCODE_UPDATED',
                data: { 
                    qrcode: data.qrcode?.code,
                    pairingCode: data.qrcode?.pairingCode,
                    count: data.qrcode?.count,
                    timestamp: new Date().toISOString()
                },
                serverUrl: process.env.SERVER_URL || 'http://localhost:3000',
                dateTime: new Date().toISOString(),
                sender: 'whatsapp-manager',
                local: false,
                integration: ['webhook']
            });
        } catch (error) {
            console.error('Erro ao processar QR Code:', error);
        }
    });
}

/**
 * Exemplo de integração com o servidor WhatsApp existente
 */
function integrateWithWhatsAppServer(server) {
    console.log('🔗 Integrando Event Controller com servidor WhatsApp...');

    // Adiciona o event emitter ao servidor
    server.eventEmitter = new EventEmitter();
    
    // Configura o monitoring service
    const monitoringService = new WAMonitoringService(
        server.eventEmitter,
        server.configService || { get: () => ({}) },
        server.supabaseRepository || new SupabaseRepository(),
        server.providerFiles || new ProviderFiles(),
        server.cache || { delete: async () => {}, keys: async () => [] },
        server.chatwootCache || { delete: async () => {}, keys: async () => [] },
        server.baileysCache || { delete: async () => {}, keys: async () => [] }
    );
    
    // Cria o event controller
    const eventController = new EventController(
        server.supabaseRepository || new SupabaseRepository(),
        monitoringService,
        true, // integrationStatus
        'webhook' // integrationName
    );
    
    // Adiciona ao servidor
    server.monitoringService = monitoringService;
    server.eventController = eventController;
    
    // Configura event listeners específicos para WhatsApp
    setupWhatsAppEventListeners(server.eventEmitter, monitoringService, eventController);
    
    console.log('✅ Event Controller integrado ao servidor WhatsApp');
}

/**
 * Exemplo de configuração de webhook para integrações
 */
async function setupWebhookIntegration(eventController, instanceName) {
    try {
        // Configura webhook para uma instância
        await eventController.set(instanceName, {
            webhook: {
                enabled: true,
                events: [
                    'MESSAGES_UPSERT',
                    'CONNECTION_UPDATE',
                    'QRCODE_UPDATED',
                    'RECONNECT_FAILED',
                    'LOGOUT_INSTANCE'
                ]
            }
        });

        console.log(`✅ Webhook configurado para instância: ${instanceName}`);
        
        // Obtém configuração atual
        const config = await eventController.get(instanceName);
        console.log('📋 Configuração atual:', config);
        
    } catch (error) {
        console.error('❌ Erro ao configurar webhook:', error);
    }
}

/**
 * Exemplo de monitoramento de instâncias
 */
function setupInstanceMonitoring(monitoringService) {
    console.log('📊 Configurando monitoramento de instâncias...');
    
    // Monitora status das instâncias a cada 30 segundos
    setInterval(async () => {
        try {
            const instances = await monitoringService.instanceInfo();
            
            instances.forEach(instance => {
                const status = instance.connectionStatus;
                const name = instance.name;
                
                if (status === 'close') {
                    console.log(`⚠️ Instância ${name} está desconectada`);
                } else if (status === 'open') {
                    console.log(`✅ Instância ${name} está conectada`);
                } else if (status === 'connecting') {
                    console.log(`🔄 Instância ${name} está conectando...`);
                }
            });
            
        } catch (error) {
            console.error('❌ Erro no monitoramento:', error);
        }
    }, 30000);
}

/**
 * Exemplo de uso completo
 */
async function exampleWhatsAppIntegration() {
    try {
        console.log('🚀 Iniciando integração do Event Controller com WhatsApp...\n');

        const { eventEmitter, monitoringService, eventController } = await setupEventControllerForWhatsApp();
        
        // Carrega instâncias existentes
        await monitoringService.loadInstance();
        
        // Configura monitoramento
        setupInstanceMonitoring(monitoringService);
        
        // Exemplo: configurar webhook para instância
        await setupWebhookIntegration(eventController, 'ZapBless');
        
        // Exemplo: salvar nova instância
        await monitoringService.saveInstance({
            instanceId: 'zapbless-instance-123',
            instanceName: 'ZapBless',
            ownerJid: '5512981606045@s.whatsapp.net',
            profileName: 'ZapBless Bot',
            profilePicUrl: null,
            integration: DEFAULT_CONFIG.INTEGRATION,
            number: '5512981606045',
            hash: 'zapbless-hash-123',
            businessId: null
        });
        
        console.log('\n✅ Integração concluída com sucesso!');
        console.log('📡 Eventos sendo monitorados...');
        console.log('🔗 Webhooks configurados...');
        console.log('📊 Monitoramento ativo...');
        
    } catch (error) {
        console.error('❌ Erro na integração:', error);
    }
}

/**
 * Função para integrar com o servidor existente
 */
function integrateWithExistingServer(server) {
    try {
        // Integra o Event Controller
        integrateWithWhatsAppServer(server);
        
        // Configura monitoramento
        setupInstanceMonitoring(server.monitoringService);
        
        // Configura webhook para instância padrão
        setupWebhookIntegration(server.eventController, 'ZapBless');
        
        console.log('🎉 Event Controller integrado com sucesso ao servidor existente!');
        
    } catch (error) {
        console.error('❌ Erro ao integrar com servidor existente:', error);
    }
}

// -- STATEMENTS

// Executa o exemplo se o arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    exampleWhatsAppIntegration().then(() => {
        console.log('\n🎉 Exemplo executado com sucesso');
        process.exit(0);
    }).catch((error) => {
        console.error('\n💥 Erro ao executar exemplo:', error);
        process.exit(1);
    });
}

export {
    setupEventControllerForWhatsApp,
    setupWhatsAppEventListeners,
    integrateWithWhatsAppServer,
    setupWebhookIntegration,
    setupInstanceMonitoring,
    exampleWhatsAppIntegration,
    integrateWithExistingServer
}; 