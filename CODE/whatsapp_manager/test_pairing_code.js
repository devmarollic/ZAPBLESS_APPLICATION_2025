#!/usr/bin/env node

/**
 * Script de Teste para Pairing Code
 * 
 * Este script testa a funcionalidade de pairing code do WhatsApp Manager
 * de forma automatizada.
 */

const axios = require('axios');

// Configurações
const CONFIG = {
    baseUrl: process.env.WHATSAPP_MANAGER_URL || 'http://localhost:3001',
    phoneNumber: process.env.TEST_PHONE_NUMBER || '5511999999999',
    testNumber: process.env.TEST_DESTINATION || '5511888888888@s.whatsapp.net',
    timeout: 30000,
    retries: 3
};

// Cores para console
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

// Teste de conexão
async function testConnection() {
    logInfo('Testando conexão com WhatsApp Manager...');
    
    try {
        const response = await axios.get(`${CONFIG.baseUrl}/health`, {
            timeout: CONFIG.timeout
        });
        
        logSuccess(`Conectado! Status: ${response.data.status}`);
        return true;
    } catch (error) {
        logError(`Falha na conexão: ${error.message}`);
        return false;
    }
}

// Teste de geração de pairing code
async function testPairingCode() {
    logInfo('Testando geração de pairing code...');
    
    try {
        const response = await axios.post(`${CONFIG.baseUrl}/start`, {
            phoneNumber: CONFIG.phoneNumber
        }, {
            timeout: CONFIG.timeout,
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.data.success) {
            logSuccess('Sessão iniciada com sucesso!');
            
            if (response.data.pairingCode) {
                logSuccess(`Pairing Code gerado: ${response.data.pairingCode}`);
                logInfo('Status: ' + response.data.status);
                return response.data.pairingCode;
            } else {
                logWarning('Nenhum pairing code foi gerado');
                return null;
            }
        } else {
            logError(`Erro ao iniciar sessão: ${response.data.error || 'Desconhecido'}`);
            return null;
        }
    } catch (error) {
        logError(`Erro ao gerar pairing code: ${error.message}`);
        return null;
    }
}

// Teste de verificação de status
async function testStatus() {
    logInfo('Verificando status da sessão...');
    
    try {
        const response = await axios.get(`${CONFIG.baseUrl}/status`, {
            timeout: CONFIG.timeout
        });
        
        const data = response.data;
        logSuccess(`Status: ${data.status}`);
        logInfo(`Sessão: ${data.sessionId || 'N/A'}`);
        
        if (data.pairingCode) {
            logInfo(`Pairing Code: ${data.pairingCode}`);
        }
        
        if (data.qrCode) {
            logInfo(`QR Code: ${data.qrCode}`);
        }
        
        return data;
    } catch (error) {
        logError(`Erro ao verificar status: ${error.message}`);
        return null;
    }
}

// Teste de monitoramento de status
async function monitorStatus(duration = 60000) {
    logInfo(`Monitorando status por ${duration / 1000} segundos...`);
    
    const startTime = Date.now();
    let attempts = 0;
    
    const interval = setInterval(async () => {
        attempts++;
        const elapsed = Date.now() - startTime;
        
        if (elapsed >= duration) {
            clearInterval(interval);
            logInfo('Monitoramento concluído');
            return;
        }
        
        try {
            const status = await testStatus();
            
            if (status && status.status === 'open') {
                logSuccess('WhatsApp conectado com sucesso!');
                clearInterval(interval);
                return;
            }
            
            logInfo(`Tentativa ${attempts} - Aguardando conexão...`);
        } catch (error) {
            logError(`Erro na tentativa ${attempts}: ${error.message}`);
        }
    }, 5000);
}

// Teste de envio de mensagem
async function testSendMessage() {
    logInfo('Testando envio de mensagem...');
    
    try {
        const response = await axios.post(`${CONFIG.baseUrl}/send/text`, {
            to: CONFIG.testNumber,
            text: '🧪 Teste automático do WhatsApp Manager - ' + new Date().toISOString()
        }, {
            timeout: CONFIG.timeout,
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.status === 200) {
            logSuccess('Mensagem enviada com sucesso!');
            return true;
        } else {
            logError(`Erro ao enviar mensagem: ${response.status}`);
            return false;
        }
    } catch (error) {
        logError(`Erro ao enviar mensagem: ${error.message}`);
        return false;
    }
}

// Teste completo
async function runFullTest() {
    log('🚀 Iniciando teste completo do Pairing Code', 'bright');
    log('', 'reset');
    
    // 1. Testar conexão
    const connected = await testConnection();
    if (!connected) {
        logError('Teste abortado: não foi possível conectar ao WhatsApp Manager');
        process.exit(1);
    }
    
    log('', 'reset');
    
    // 2. Gerar pairing code
    const pairingCode = await testPairingCode();
    if (!pairingCode) {
        logWarning('Pairing code não foi gerado, mas continuando o teste...');
    }
    
    log('', 'reset');
    
    // 3. Verificar status inicial
    await testStatus();
    
    log('', 'reset');
    
    // 4. Monitorar status por 2 minutos
    logInfo('Aguardando conexão do WhatsApp...');
    logInfo('Digite o pairing code no WhatsApp do celular se necessário');
    await monitorStatus(120000); // 2 minutos
    
    log('', 'reset');
    
    // 5. Verificar status final
    const finalStatus = await testStatus();
    
    log('', 'reset');
    
    // 6. Testar envio de mensagem se conectado
    if (finalStatus && finalStatus.status === 'open') {
        await testSendMessage();
    } else {
        logWarning('WhatsApp não está conectado, pulando teste de envio');
    }
    
    log('', 'reset');
    log('🎉 Teste completo finalizado!', 'bright');
}

// Função principal
async function main() {
    const args = process.argv.slice(2);
    
    switch (args[0]) {
        case 'connection':
            await testConnection();
            break;
            
        case 'pairing':
            await testPairingCode();
            break;
            
        case 'status':
            await testStatus();
            break;
            
        case 'monitor':
            const duration = parseInt(args[1]) || 60000;
            await monitorStatus(duration);
            break;
            
        case 'send':
            await testSendMessage();
            break;
            
        case 'full':
        default:
            await runFullTest();
            break;
    }
}

// Tratamento de erros
process.on('unhandledRejection', (reason, promise) => {
    logError('Unhandled Rejection at:');
    logError(`Promise: ${promise}`);
    logError(`Reason: ${reason}`);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    logError('Uncaught Exception:');
    logError(error.message);
    logError(error.stack);
    process.exit(1);
});

// Executar se for o arquivo principal
if (require.main === module) {
    main().catch(error => {
        logError(`Erro no teste: ${error.message}`);
        process.exit(1);
    });
}

module.exports = {
    testConnection,
    testPairingCode,
    testStatus,
    monitorStatus,
    testSendMessage,
    runFullTest
}; 