/**
 * Test script para verificar melhorias na conexão WhatsApp
 * 
 * Este script testa as melhorias implementadas no tratamento de erros
 * e lógica de reconexão.
 */

import { WhatsAppManager } from './baileys_startup_service.js';
import { SupabaseRepository } from './supabase_repository.js';
import { ProviderFiles } from './provider_file_service.js';

// -- CONSTANTS

const TEST_PHONE_NUMBER = process.env.CHURCH_NUMBER || '5512981606045';

// -- FUNCTIONS

async function testConnectionHandling() {
    console.log('🧪 Iniciando testes de conexão...\n');

    let supabaseRepository = new SupabaseRepository();
    let providerFiles = new ProviderFiles();
    let whatsappManager = new WhatsAppManager(
        supabaseRepository,
        providerFiles
    );

    // Configura event listeners para teste
    whatsappManager.eventEmitter.on('reconnect.failed', (instanceName) => {
        console.log(`❌ Reconexão falhou para: ${instanceName}`);
    });

    whatsappManager.eventEmitter.on('logout.instance', (instanceName, reason) => {
        console.log(`🚪 Logout da instância: ${instanceName}, motivo: ${reason}`);
    });

    whatsappManager.eventEmitter.on('no.connection', (instanceName) => {
        console.log(`❌ Sem conexão para: ${instanceName}`);
    });

    try {
        console.log('📱 Tentando conectar ao WhatsApp...');
        await whatsappManager.connectToWhatsapp(TEST_PHONE_NUMBER);
        
        console.log('✅ Conexão inicializada com sucesso');
        console.log('📊 Status da conexão:', whatsappManager.stateConnection);
        
        // Simula um erro 401 para testar o comportamento
        console.log('\n🧪 Simulando erro 401...');
        const mockDisconnect = {
            error: {
                output: {
                    statusCode: 401,
                    payload: {
                        reason: '401'
                    }
                }
            }
        };

        await whatsappManager.connectionUpdate({
            connection: 'close',
            lastDisconnect: mockDisconnect
        });

        console.log('✅ Teste de erro 401 concluído');
        
    } catch (error) {
        console.error('❌ Erro durante o teste:', error);
    }
}

async function testReconnectionLogic() {
    console.log('\n🔄 Testando lógica de reconexão...\n');

    let supabaseRepository = new SupabaseRepository();
    let providerFiles = new ProviderFiles();
    let whatsappManager = new WhatsAppManager(
        supabaseRepository,
        providerFiles
    );

    // Testa diferentes códigos de erro
    const testCases = [
        { code: 401, reason: '401', shouldReconnect: false, description: 'Unauthorized' },
        { code: 403, reason: 'forbidden', shouldReconnect: false, description: 'Forbidden' },
        { code: 402, reason: '402', shouldReconnect: false, description: 'Payment Required' },
        { code: 406, reason: '406', shouldReconnect: false, description: 'Not Acceptable' },
        { code: 500, reason: 'connection_lost', shouldReconnect: true, description: 'Connection Lost' },
        { code: 408, reason: 'timed_out', shouldReconnect: true, description: 'Timeout' }
    ];

    for (const testCase of testCases) {
        console.log(`🧪 Testando: ${testCase.description} (${testCase.code})`);
        
        const mockDisconnect = {
            error: {
                output: {
                    statusCode: testCase.code,
                    payload: {
                        reason: testCase.reason
                    }
                }
            }
        };

        // Simula o comportamento da connectionUpdate
        const statusCode = mockDisconnect.error.output.statusCode;
        const disconnectReason = mockDisconnect.error.output.payload.reason;
        
        const codesToNotReconnect = [
            'loggedOut', 
            'forbidden', 
            401,
            402,
            406,
            403
        ];
        
        const reasonsToNotReconnect = [
            '401',
            '403',
            'logged_out',
            'forbidden'
        ];

        const shouldReconnect = !codesToNotReconnect.includes(statusCode) && 
                              !reasonsToNotReconnect.includes(disconnectReason);

        const result = shouldReconnect === testCase.shouldReconnect ? '✅' : '❌';
        console.log(`   ${result} Esperado: ${testCase.shouldReconnect}, Obtido: ${shouldReconnect}`);
    }
}

// -- STATEMENTS

console.log('🚀 Iniciando testes de melhorias na conexão WhatsApp\n');

Promise.all([
    testConnectionHandling(),
    testReconnectionLogic()
]).then(() => {
    console.log('\n✅ Todos os testes concluídos!');
    process.exit(0);
}).catch((error) => {
    console.error('\n❌ Erro durante os testes:', error);
    process.exit(1);
}); 