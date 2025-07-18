/**
 * Exemplo de uso do Event Controller
 * 
 * Demonstra como integrar o WAMonitoringService no servidor WhatsApp
 * e como configurar os event listeners.
 */

import { EventEmitter } from 'events';
import { WAMonitoringService } from './event_controller.js';
import { SupabaseRepository } from './supabase_repository.js';
import { ProviderFiles } from './provider_file_service.js';
import { EVENTS, DEFAULT_CONFIG } from './event_config.js';

// -- CONSTANTS

// -- TYPES

// -- VARIABLES

// -- FUNCTIONS

/**
 * Exemplo de configuração do Event Controller
 */
async function setupEventController() {
    console.log('🔧 Configurando Event Controller...');

    // Cria o event emitter principal
    const eventEmitter = new EventEmitter();
    
    // Configurações mock (substitua pelas suas configurações reais)
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

    // Configura event listeners adicionais
    setupCustomEventListeners(eventEmitter, monitoringService);

    console.log('✅ Event Controller configurado com sucesso');
    
    return { eventEmitter, monitoringService };
}

/**
 * Configura event listeners customizados
 */
function setupCustomEventListeners(eventEmitter, monitoringService) {
    // Listener para reconexão falhada
    eventEmitter.on(EVENTS.RECONNECT_FAILED, async (instanceName) => {
        console.log(`🚨 Reconexão falhou para: ${instanceName}`);
        
        // Aqui você pode implementar:
        // - Notificações para administradores
        // - Logs detalhados
        // - Tentativas de recuperação automática
        // - Alertas por email/SMS
        
        try {
            // Exemplo: enviar notificação
            await sendNotificationToAdmin(instanceName, 'RECONNECT_FAILED');
            
            // Exemplo: tentar limpar e recriar a sessão
            await monitoringService.cleaningUp(instanceName);
            
        } catch (error) {
            console.error('Erro ao tratar falha de reconexão:', error);
        }
    });

    // Listener para logout de instância
    eventEmitter.on(EVENTS.LOGOUT_INSTANCE, async (instanceName, reason) => {
        console.log(`🚪 Logout da instância: ${instanceName}, motivo: ${reason}`);
        
        // Aqui você pode implementar:
        // - Limpeza de recursos
        // - Notificações
        // - Logs de auditoria
        
        try {
            await sendNotificationToAdmin(instanceName, 'LOGOUT', reason);
        } catch (error) {
            console.error('Erro ao processar logout:', error);
        }
    });

    // Listener para remoção de instância
    eventEmitter.on(EVENTS.REMOVE_INSTANCE, async (instanceName, reason) => {
        console.log(`🗑️ Instância removida: ${instanceName}, motivo: ${reason}`);
        
        // Aqui você pode implementar:
        // - Limpeza completa de dados
        // - Notificações
        // - Logs de auditoria
        
        try {
            await sendNotificationToAdmin(instanceName, 'REMOVED', reason);
        } catch (error) {
            console.error('Erro ao processar remoção:', error);
        }
    });

    // Listener para sem conexão
    eventEmitter.on(EVENTS.NO_CONNECTION, async (instanceName) => {
        console.log(`❌ Sem conexão para: ${instanceName}`);
        
        // Aqui você pode implementar:
        // - Tentativas de recuperação
        // - Notificações
        // - Logs de diagnóstico
        
        try {
            await sendNotificationToAdmin(instanceName, 'NO_CONNECTION');
        } catch (error) {
            console.error('Erro ao processar falta de conexão:', error);
        }
    });
}

/**
 * Exemplo de função para enviar notificações
 */
async function sendNotificationToAdmin(instanceName, eventType, reason = '') {
    // Implemente sua lógica de notificação aqui
    // Exemplo: email, SMS, webhook, etc.
    
    const notification = {
        timestamp: new Date().toISOString(),
        instanceName,
        eventType,
        reason,
        severity: getSeverityLevel(eventType)
    };
    
    console.log('📧 Notificação enviada:', notification);
    
    // Exemplo: enviar para webhook
    try {
        const response = await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notification)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
    }
}

/**
 * Determina o nível de severidade baseado no tipo de evento
 */
function getSeverityLevel(eventType) {
    const severityMap = {
        'RECONNECT_FAILED': 'HIGH',
        'LOGOUT': 'MEDIUM',
        'REMOVED': 'LOW',
        'NO_CONNECTION': 'MEDIUM'
    };
    
    return severityMap[eventType] || 'LOW';
}

/**
 * Exemplo de uso do monitoring service
 */
async function exampleUsage() {
    try {
        const { eventEmitter, monitoringService } = await setupEventController();
        
        // Carrega instâncias existentes
        await monitoringService.loadInstance();
        
        // Exemplo: obter informações de uma instância
        const instanceInfo = await monitoringService.instanceInfo(['ZapBless']);
        console.log('📊 Informações da instância:', instanceInfo);
        
        // Exemplo: salvar nova instância
        await monitoringService.saveInstance({
            instanceId: 'test-instance-123',
            instanceName: 'TestInstance',
            ownerJid: '5512981606045@s.whatsapp.net',
            profileName: 'Test User',
            profilePicUrl: null,
            integration: DEFAULT_CONFIG.INTEGRATION,
            number: '5512981606045',
            hash: 'test-hash-123',
            businessId: null
        });
        
        // Exemplo: deletar instância
        // monitoringService.deleteInstance('TestInstance');
        
        // Exemplo: configurar timeout para instância
        monitoringService.delInstanceTime('ZapBless');
        
        console.log('✅ Exemplo de uso concluído');
        
    } catch (error) {
        console.error('❌ Erro no exemplo de uso:', error);
    }
}

/**
 * Exemplo de integração com o servidor principal
 */
function integrateWithServer(server) {
    // Adiciona o event emitter ao servidor
    server.eventEmitter = new EventEmitter();
    
    // Configura o monitoring service
    const monitoringService = new WAMonitoringService(
        server.eventEmitter,
        server.configService,
        server.supabaseRepository,
        server.providerFiles,
        server.cache,
        server.chatwootCache,
        server.baileysCache
    );
    
    // Adiciona ao servidor
    server.monitoringService = monitoringService;
    
    // Configura event listeners customizados
    setupCustomEventListeners(server.eventEmitter, monitoringService);
    
    console.log('🔗 Event Controller integrado ao servidor');
}

// -- STATEMENTS

// Executa o exemplo se o arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    exampleUsage().then(() => {
        console.log('🎉 Exemplo executado com sucesso');
        process.exit(0);
    }).catch((error) => {
        console.error('💥 Erro ao executar exemplo:', error);
        process.exit(1);
    });
}

export {
    setupEventController,
    setupCustomEventListeners,
    sendNotificationToAdmin,
    getSeverityLevel,
    exampleUsage,
    integrateWithServer
}; 