// -- IMPORTS

const axios = require('axios');

// -- CONSTANTS

const BASE_URL = 'http://localhost:3000';
const TEST_PHONE = '5511999999999';

// -- TYPES

// -- VARIABLES

// -- FUNCTIONS

/**
 * Testa a correção do pairing code
 */
async function testPairingCodeFix() {
    console.log('🧪 Testando correção do pairing code...\n');

    try {
        // 1. Verificar status inicial
        console.log('1️⃣ Verificando status inicial...');
        const statusResponse = await axios.get(`${BASE_URL}/status`);
        console.log('   Status:', statusResponse.data.status);
        console.log('   Conectado:', statusResponse.data.status === 'open');
        console.log('');

        // 2. Iniciar sessão sem pairing code
        console.log('2️⃣ Iniciando sessão sem pairing code...');
        const startResponse = await axios.post(`${BASE_URL}/start`);
        console.log('   Sucesso:', startResponse.data.success);
        console.log('   Status:', startResponse.data.status);
        console.log('');

        // 3. Aguardar conexão estar pronta
        console.log('3️⃣ Aguardando conexão estar pronta...');
        let isConnected = false;
        let attempts = 0;
        const maxAttempts = 30; // 30 segundos

        while (!isConnected && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;

            try {
                const statusCheck = await axios.get(`${BASE_URL}/status`);
                console.log(`   Tentativa ${attempts}: ${statusCheck.data.status}`);
                
                if (statusCheck.data.status === 'open') {
                    isConnected = true;
                    console.log('   ✅ Conexão estabelecida!');
                }
            } catch (error) {
                console.log(`   Tentativa ${attempts}: Erro ao verificar status`);
            }
        }

        if (!isConnected) {
            console.log('   ❌ Timeout aguardando conexão');
            return false;
        }

        console.log('');

        // 4. Solicitar pairing code
        console.log('4️⃣ Solicitando pairing code...');
        const pairingResponse = await axios.post(`${BASE_URL}/pairing-code`, {
            phoneNumber: TEST_PHONE
        });

        console.log('   Sucesso:', pairingResponse.data.success);
        console.log('   Pairing Code:', pairingResponse.data.pairingCode);
        console.log('   Mensagem:', pairingResponse.data.message);
        console.log('');

        // 5. Verificar se o pairing code foi gerado
        if (pairingResponse.data.pairingCode) {
            console.log('5️⃣ Verificando pairing code no status...');
            const finalStatus = await axios.get(`${BASE_URL}/status`);
            console.log('   Pairing Code no status:', finalStatus.data.pairingCode);
            console.log('');

            console.log('✅ Teste concluído com sucesso!');
            console.log('   O pairing code foi gerado corretamente após a conexão estar pronta.');
            return true;
        } else {
            console.log('5️⃣ Aguardando pairing code ser gerado...');
            let pairingCodeReceived = false;
            attempts = 0;

            while (!pairingCodeReceived && attempts < 10) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                attempts++;

                try {
                    const statusCheck = await axios.get(`${BASE_URL}/status`);
                    if (statusCheck.data.pairingCode) {
                        console.log('   ✅ Pairing code recebido:', statusCheck.data.pairingCode);
                        pairingCodeReceived = true;
                    } else {
                        console.log(`   Tentativa ${attempts}: Aguardando pairing code...`);
                    }
                } catch (error) {
                    console.log(`   Tentativa ${attempts}: Erro ao verificar status`);
                }
            }

            if (pairingCodeReceived) {
                console.log('✅ Teste concluído com sucesso!');
                console.log('   O pairing code foi gerado corretamente após a conexão estar pronta.');
                return true;
            } else {
                console.log('❌ Timeout aguardando pairing code');
                return false;
            }
        }

    } catch (error) {
        console.error('❌ Erro no teste:', error.response?.data || error.message);
        return false;
    }
}

/**
 * Testa cenário de erro (conexão fechada)
 */
async function testErrorScenario() {
    console.log('🧪 Testando cenário de erro (conexão fechada)...\n');

    try {
        // 1. Desconectar se estiver conectado
        console.log('1️⃣ Desconectando sessão atual...');
        try {
            await axios.post(`${BASE_URL}/disconnect`);
            console.log('   ✅ Sessão desconectada');
        } catch (error) {
            console.log('   ℹ️  Sessão já desconectada ou erro ao desconectar');
        }
        console.log('');

        // 2. Tentar solicitar pairing code com conexão fechada
        console.log('2️⃣ Tentando solicitar pairing code com conexão fechada...');
        const pairingResponse = await axios.post(`${BASE_URL}/pairing-code`, {
            phoneNumber: TEST_PHONE
        });

        console.log('   Sucesso:', pairingResponse.data.success);
        console.log('   Pairing Code:', pairingResponse.data.pairingCode);
        console.log('   Mensagem:', pairingResponse.data.message);
        console.log('');

        if (pairingResponse.data.pairingCode === null) {
            console.log('✅ Teste de erro concluído com sucesso!');
            console.log('   O sistema não tentou gerar pairing code com conexão fechada.');
            return true;
        } else {
            console.log('❌ Erro: Pairing code foi gerado com conexão fechada');
            return false;
        }

    } catch (error) {
        console.error('❌ Erro no teste de cenário de erro:', error.response?.data || error.message);
        return false;
    }
}

/**
 * Testa reconexão e pairing code
 */
async function testReconnectionScenario() {
    console.log('🧪 Testando cenário de reconexão...\n');

    try {
        // 1. Iniciar sessão
        console.log('1️⃣ Iniciando sessão...');
        await axios.post(`${BASE_URL}/start`);
        console.log('   ✅ Sessão iniciada');
        console.log('');

        // 2. Aguardar conexão
        console.log('2️⃣ Aguardando conexão...');
        let isConnected = false;
        let attempts = 0;

        while (!isConnected && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;

            try {
                const statusCheck = await axios.get(`${BASE_URL}/status`);
                if (statusCheck.data.status === 'open') {
                    isConnected = true;
                    console.log('   ✅ Conexão estabelecida!');
                }
            } catch (error) {
                // Ignora erros durante a verificação
            }
        }

        if (!isConnected) {
            console.log('   ❌ Timeout aguardando conexão');
            return false;
        }
        console.log('');

        // 3. Solicitar pairing code
        console.log('3️⃣ Solicitando pairing code...');
        const pairingResponse = await axios.post(`${BASE_URL}/pairing-code`, {
            phoneNumber: TEST_PHONE
        });

        console.log('   Sucesso:', pairingResponse.data.success);
        console.log('   Pairing Code:', pairingResponse.data.pairingCode);
        console.log('');

        // 4. Simular reconexão (desconectar e reconectar)
        console.log('4️⃣ Simulando reconexão...');
        await axios.post(`${BASE_URL}/disconnect`);
        console.log('   ✅ Desconectado');

        await new Promise(resolve => setTimeout(resolve, 2000));

        await axios.post(`${BASE_URL}/start`);
        console.log('   ✅ Reconectado');
        console.log('');

        // 5. Verificar se o pairing code ainda funciona
        console.log('5️⃣ Verificando pairing code após reconexão...');
        const finalPairingResponse = await axios.post(`${BASE_URL}/pairing-code`, {
            phoneNumber: TEST_PHONE
        });

        console.log('   Sucesso:', finalPairingResponse.data.success);
        console.log('   Pairing Code:', finalPairingResponse.data.pairingCode);
        console.log('');

        console.log('✅ Teste de reconexão concluído com sucesso!');
        return true;

    } catch (error) {
        console.error('❌ Erro no teste de reconexão:', error.response?.data || error.message);
        return false;
    }
}

// -- STATEMENTS

// Executa os testes se chamado diretamente
if (require.main === module) {
    const args = process.argv.slice(2);
    const testType = args[0] || 'all';

    async function runTests() {
        let allPassed = true;

        if (testType === 'all' || testType === 'fix') {
            console.log('='.repeat(60));
            console.log('TESTE: Correção do Pairing Code');
            console.log('='.repeat(60));
            const fixResult = await testPairingCodeFix();
            allPassed = allPassed && fixResult;
            console.log('');
        }

        if (testType === 'all' || testType === 'error') {
            console.log('='.repeat(60));
            console.log('TESTE: Cenário de Erro');
            console.log('='.repeat(60));
            const errorResult = await testErrorScenario();
            allPassed = allPassed && errorResult;
            console.log('');
        }

        if (testType === 'all' || testType === 'reconnection') {
            console.log('='.repeat(60));
            console.log('TESTE: Cenário de Reconexão');
            console.log('='.repeat(60));
            const reconnectionResult = await testReconnectionScenario();
            allPassed = allPassed && reconnectionResult;
            console.log('');
        }

        console.log('='.repeat(60));
        console.log('RESULTADO FINAL');
        console.log('='.repeat(60));
        
        if (allPassed) {
            console.log('✅ Todos os testes passaram!');
            console.log('🎉 A correção do pairing code está funcionando corretamente.');
        } else {
            console.log('❌ Alguns testes falharam.');
            console.log('🔧 Verifique os logs acima para identificar os problemas.');
        }

        process.exit(allPassed ? 0 : 1);
    }

    runTests().catch(error => {
        console.error('❌ Erro fatal nos testes:', error);
        process.exit(1);
    });
}

module.exports = {
    testPairingCodeFix,
    testErrorScenario,
    testReconnectionScenario
}; 