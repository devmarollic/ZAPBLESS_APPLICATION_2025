/**
 * Configuração do Event Controller
 * 
 * Centraliza as configurações e constantes utilizadas pelo
 * WAMonitoringService e outros componentes do sistema.
 */

// -- IMPORTS

// -- CONSTANTS

// Eventos do sistema
export const EVENTS = {
    REMOVE_INSTANCE: 'remove.instance',
    LOGOUT_INSTANCE: 'logout.instance',
    NO_CONNECTION: 'no.connection',
    RECONNECT_FAILED: 'reconnect.failed',
    CONNECTION_UPDATE: 'connection.update',
    QRCODE_UPDATED: 'qrcode.updated',
    STATUS_INSTANCE: 'status.instance',
    MESSAGES_UPSERT: 'messages.upsert',
    MESSAGES_UPDATE: 'messages.update',
    MESSAGES_DELETE: 'messages.delete',
    SEND_MESSAGE: 'send.message',
    SEND_MESSAGE_UPDATE: 'send.message.update',
    CONTACTS_UPSERT: 'contacts.upsert',
    CONTACTS_UPDATE: 'contacts.update',
    CHATS_UPSERT: 'chats.upsert',
    CHATS_UPDATE: 'chats.update',
    CHATS_DELETE: 'chats.delete',
    GROUPS_UPSERT: 'groups.upsert',
    GROUPS_UPDATE: 'groups.update',
    GROUP_PARTICIPANTS_UPDATE: 'group-participants.update',
    PRESENCE_UPDATE: 'presence.update',
    CALL: 'call',
    CREDS_UPDATE: 'creds.update',
    MESSAGING_HISTORY_SET: 'messaging-history.set'
};

// Status de conexão
export const CONNECTION_STATUS = {
    OPEN: 'open',
    CLOSE: 'close',
    CONNECTING: 'connecting',
    RECONNECTING: 'reconnecting'
};

// Códigos de erro que não devem reconectar
export const NON_RECONNECT_ERRORS = [
    401, // Unauthorized
    403, // Forbidden
    402, // Payment Required
    406, // Not Acceptable
    'loggedOut',
    'forbidden'
];

// Configurações padrão
export const DEFAULT_CONFIG = {
    CLIENT_NAME: 'ZapBless',
    INTEGRATION: 'WhatsApp',
    MAX_RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 2000,
    MAX_RECONNECT_DELAY: 30000,
    INSTANCE_TIMEOUT: 60, // minutos
    SESSION_DIR: 'sessions',
    STORE_DIR: 'store'
};

// Configurações de limpeza
export const CLEANUP_CONFIG = {
    ENABLE_CHATWOOT_CLEANUP: true,
    ENABLE_SESSION_CLEANUP: true,
    ENABLE_DATABASE_CLEANUP: true,
    ENABLE_CACHE_CLEANUP: true
};

// -- TYPES

// -- VARIABLES

// -- FUNCTIONS

/**
 * Obtém configuração do ambiente
 * @param {string} key - Chave da configuração
 * @param {any} defaultValue - Valor padrão
 * @returns {any} - Valor da configuração
 */
export function getConfig(key, defaultValue = null) {
    return process.env[key] || defaultValue;
}

/**
 * Obtém configuração de banco de dados
 * @returns {Object} - Configuração do banco
 */
export function getDatabaseConfig() {
    return {
        SAVE_DATA: {
            INSTANCE: getConfig('SAVE_INSTANCE_DATA', true)
        },
        CONNECTION: {
            CLIENT_NAME: getConfig('CLIENT_NAME', DEFAULT_CONFIG.CLIENT_NAME)
        }
    };
}

/**
 * Obtém configuração de cache
 * @returns {Object} - Configuração do cache
 */
export function getCacheConfig() {
    return {
        REDIS: {
            ENABLED: getConfig('REDIS_ENABLED', false),
            SAVE_INSTANCES: getConfig('REDIS_SAVE_INSTANCES', false)
        }
    };
}

/**
 * Obtém configuração de provider
 * @returns {Object} - Configuração do provider
 */
export function getProviderConfig() {
    return {
        ENABLED: getConfig('PROVIDER_ENABLED', false)
    };
}

/**
 * Obtém configuração do Chatwoot
 * @returns {Object} - Configuração do Chatwoot
 */
export function getChatwootConfig() {
    return {
        ENABLED: getConfig('CHATWOOT_ENABLED', false)
    };
}

/**
 * Obtém configuração de timeout de instância
 * @returns {number} - Timeout em minutos
 */
export function getInstanceTimeout() {
    return parseInt(getConfig('INSTANCE_TIMEOUT', DEFAULT_CONFIG.INSTANCE_TIMEOUT));
}

/**
 * Valida se um erro deve tentar reconectar
 * @param {number} statusCode - Código de status do erro
 * @param {string} reason - Razão da desconexão
 * @returns {boolean} - True se deve tentar reconectar
 */
export function shouldReconnect(statusCode, reason) {
    return !NON_RECONNECT_ERRORS.includes(statusCode) && 
           !NON_RECONNECT_ERRORS.includes(reason);
}

/**
 * Calcula delay para reconexão com backoff exponencial
 * @param {number} attempt - Número da tentativa
 * @param {number} baseDelay - Delay base em ms
 * @returns {number} - Delay calculado em ms
 */
export function calculateReconnectDelay(attempt, baseDelay = DEFAULT_CONFIG.RECONNECT_DELAY) {
    const maxDelay = DEFAULT_CONFIG.MAX_RECONNECT_DELAY;
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    
    // Adiciona jitter para evitar thundering herd
    const jitter = Math.random() * 1000;
    return delay + jitter;
}

/**
 * Obtém caminho do diretório de sessões
 * @param {string} instanceId - ID da instância
 * @returns {string} - Caminho completo
 */
export function getSessionPath(instanceId) {
    return `${DEFAULT_CONFIG.SESSION_DIR}/${instanceId}`;
}

/**
 * Obtém caminho do diretório de store
 * @param {string} subPath - Subcaminho
 * @returns {string} - Caminho completo
 */
export function getStorePath(subPath = '') {
    return `${DEFAULT_CONFIG.STORE_DIR}/${subPath}`.replace(/\/+$/, '');
}

// -- STATEMENTS

export default {
    EVENTS,
    CONNECTION_STATUS,
    NON_RECONNECT_ERRORS,
    DEFAULT_CONFIG,
    CLEANUP_CONFIG,
    getConfig,
    getDatabaseConfig,
    getCacheConfig,
    getProviderConfig,
    getChatwootConfig,
    getInstanceTimeout,
    shouldReconnect,
    calculateReconnectDelay,
    getSessionPath,
    getStorePath
}; 