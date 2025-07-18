// -- IMPORTS

const { DisconnectReason } = require('@whiskeysockets/baileys');

// -- CONSTANTS

// Configurações de conexão
const CONNECTION_CONFIG = {
    // Timeouts
    connectTimeoutMs: parseInt(process.env.CONNECT_TIMEOUT) || 60000,
    qrTimeout: parseInt(process.env.QR_TIMEOUT) || 40000,
    keepAliveIntervalMs: parseInt(process.env.KEEP_ALIVE_INTERVAL) || 30000,
    retryRequestDelayMs: 2000,
    
    // Configurações de reconexão
    maxReconnectAttempts: parseInt(process.env.MAX_RECONNECT_ATTEMPTS) || 5,
    reconnectDelayMs: parseInt(process.env.RECONNECT_DELAY) || 2000,
    exponentialBackoff: true,
    
    // Configurações de user agent
    browser: ['Chrome (Linux)', 'Chrome', '112.0.0.0'],
    
    // Configurações de proxy (opcional)
    useProxy: !!(process.env.PROXY_HOST && process.env.PROXY_PORT),
    proxyConfig: {
        host: process.env.PROXY_HOST || '',
        port: process.env.PROXY_PORT || '',
        username: process.env.PROXY_USERNAME || '',
        password: process.env.PROXY_PASSWORD || ''
    }
};

// -- TYPES

// -- VARIABLES

// -- FUNCTIONS

/**
 * Verifica se deve tentar reconectar baseado no motivo da desconexão
 * @param {number} reason - Código do motivo da desconexão
 * @returns {boolean} - True se deve tentar reconectar
 */
function shouldReconnect(reason) {
    const reconnectReasons = [
        DisconnectReason.connectionClosed,
        DisconnectReason.connectionLost,
        DisconnectReason.restartRequired,
        DisconnectReason.timedOut
    ];
    
    return reconnectReasons.includes(reason);
}

/**
 * Calcula o delay para reconexão com backoff exponencial
 * @param {number} attempt - Número da tentativa
 * @param {number} baseDelay - Delay base em ms
 * @returns {number} - Delay calculado em ms
 */
function calculateReconnectDelay(attempt, baseDelay = 2000) {
    if (!CONNECTION_CONFIG.exponentialBackoff) {
        return baseDelay;
    }
    
    const maxDelay = 30000; // 30 segundos máximo
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    
    // Adiciona jitter para evitar thundering herd
    const jitter = Math.random() * 1000;
    return delay + jitter;
}

/**
 * Obtém configurações de conexão baseadas no ambiente
 * @param {Object} logger - Logger para debug
 * @returns {Object} - Configurações de conexão
 */
function getConnectionConfig(logger) {
    const config = {
        ...CONNECTION_CONFIG,
        logger: logger
    };
    
    // Configura proxy se habilitado
    if (CONNECTION_CONFIG.useProxy && CONNECTION_CONFIG.proxyConfig.host) {
        try {
            const { HttpsProxyAgent } = require('https-proxy-agent');
            const proxyUrl = `http://${CONNECTION_CONFIG.proxyConfig.username}:${CONNECTION_CONFIG.proxyConfig.password}@${CONNECTION_CONFIG.proxyConfig.host}:${CONNECTION_CONFIG.proxyConfig.port}`;
            config.agent = new HttpsProxyAgent(proxyUrl);
            config.fetchAgent = new HttpsProxyAgent(proxyUrl);
            logger.info('Proxy configurado para conexão WhatsApp');
        } catch (error) {
            logger.warn('Erro ao configurar proxy:', error.message);
        }
    }
    
    return config;
}

/**
 * Valida configurações de rede
 * @returns {Object} - Resultado da validação
 */
async function validateNetworkConfig() {
    const validation = {
        success: true,
        issues: []
    };
    
    try {
        // Testa conectividade básica
        const https = require('https');
        const testUrl = 'https://web.whatsapp.com';
        
        await new Promise((resolve, reject) => {
            const req = https.get(testUrl, (res) => {
                if (res.statusCode === 200) {
                    resolve();
                } else {
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
            
            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('Timeout'));
            });
            
            req.on('error', reject);
        });
        
    } catch (error) {
        validation.success = false;
        validation.issues.push(`Conectividade com WhatsApp: ${error.message}`);
    }
    
    // Verifica configurações de proxy
    if (CONNECTION_CONFIG.useProxy) {
        if (!CONNECTION_CONFIG.proxyConfig.host) {
            validation.success = false;
            validation.issues.push('Proxy habilitado mas host não configurado');
        }
    }
    
    return validation;
}

/**
 * Obtém informações de diagnóstico da conexão
 * @returns {Object} - Informações de diagnóstico
 */
function getConnectionDiagnostics() {
    return {
        timestamp: new Date().toISOString(),
        config: {
            connectTimeoutMs: CONNECTION_CONFIG.connectTimeoutMs,
            qrTimeout: CONNECTION_CONFIG.qrTimeout,
            keepAliveIntervalMs: CONNECTION_CONFIG.keepAliveIntervalMs,
            maxReconnectAttempts: CONNECTION_CONFIG.maxReconnectAttempts,
            useProxy: CONNECTION_CONFIG.useProxy
        },
        environment: {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime()
        }
    };
}

// -- STATEMENTS

module.exports = {
    CONNECTION_CONFIG,
    shouldReconnect,
    calculateReconnectDelay,
    getConnectionConfig,
    validateNetworkConfig,
    getConnectionDiagnostics
}; 