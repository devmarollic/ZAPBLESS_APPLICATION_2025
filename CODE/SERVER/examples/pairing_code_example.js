/**
 * Exemplo de uso do Pairing Code para WhatsApp
 * 
 * Este exemplo demonstra como:
 * 1. Iniciar um container Docker para uma igreja
 * 2. Gerar um código de pareamento para um número de telefone
 * 3. Verificar o status da conexão
 * 4. Monitorar a conexão até ser estabelecida
 */

const axios = require('axios');

// Configurações
const BASE_URL = 'http://localhost:3000';
const CHURCH_ID = 'church_123';
const PHONE_NUMBER = '5511999999999'; // Número com código do país

async function exemploPairingCode() {
    try {
        console.log('🚀 Iniciando exemplo de Pairing Code...\n');

        // 1. Iniciar container Docker
        console.log('1️⃣ Iniciando container Docker...');
        const syncResponse = await axios.post(`${BASE_URL}/docker/sync`, {
            churchId: CHURCH_ID
        });

        if (!syncResponse.data.success) {
            throw new Error('Falha ao iniciar container: ' + syncResponse.data.message);
        }

        const containerUrl = syncResponse.data.containerUrl;
        console.log(`✅ Container iniciado: ${containerUrl}\n`);

        // 2. Aguardar container inicializar
        console.log('2️⃣ Aguardando container inicializar...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 3. Iniciar sessão com número de telefone
        console.log('3️⃣ Iniciando sessão com número de telefone...');
        const startResponse = await axios.post(`${containerUrl}/start`, {
            phoneNumber: PHONE_NUMBER
        });

        if (!startResponse.data.success) {
            throw new Error('Falha ao iniciar sessão: ' + startResponse.data.message);
        }

        console.log(`✅ Sessão iniciada. Status: ${startResponse.data.status}`);

        // 4. Verificar se pairing code foi gerado
        if (startResponse.data.pairingCode) {
            console.log(`🔐 Código de pareamento gerado: ${startResponse.data.pairingCode}`);
            console.log('📱 Digite este código no WhatsApp do celular:');
            console.log('   WhatsApp → Configurações → Dispositivos vinculados → Vincular dispositivo → Código de pareamento\n');
        } else {
            console.log('⚠️ Nenhum código de pareamento gerado. Verificando status...\n');
        }

        // 5. Monitorar status da conexão
        console.log('4️⃣ Monitorando status da conexão...');
        let attempts = 0;
        const maxAttempts = 30; // 5 minutos (10 segundos cada)

        const checkStatus = async () => {
            try {
                const statusResponse = await axios.get(`${containerUrl}/status`);
                const status = statusResponse.data;

                console.log(`📊 Status atual: ${status.status}`);

                if (status.status === 'open') {
                    console.log('🎉 WhatsApp conectado com sucesso!');
                    return true;
                } else if (status.status === 'connecting') {
                    if (status.pairingCode && status.pairingCode !== startResponse.data.pairingCode) {
                        console.log(`🔄 Novo código de pareamento: ${status.pairingCode}`);
                    }
                    return false;
                } else {
                    console.log('❌ Status inesperado:', status.status);
                    return false;
                }
            } catch (error) {
                console.error('❌ Erro ao verificar status:', error.message);
                return false;
            }
        };

        // Loop de verificação
        while (attempts < maxAttempts) {
            const isConnected = await checkStatus();
            
            if (isConnected) {
                break;
            }

            attempts++;
            console.log(`⏳ Aguardando... (${attempts}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 10000)); // 10 segundos
        }

        if (attempts >= maxAttempts) {
            console.log('⏰ Timeout: Tempo limite excedido para conexão');
        }

        // 6. Verificar status final
        console.log('\n5️⃣ Status final:');
        const finalStatusResponse = await axios.get(`${containerUrl}/status`);
        console.log('📊 Status final:', finalStatusResponse.data);

        // 7. Exemplo de envio de mensagem (se conectado)
        if (finalStatusResponse.data.status === 'open') {
            console.log('\n6️⃣ Exemplo de envio de mensagem:');
            try {
                const messageResponse = await axios.post(`${containerUrl}/send/text`, {
                    to: '5511888888888@s.whatsapp.net',
                    text: 'Olá! Esta é uma mensagem de teste do ZapBless.'
                });
                console.log('✅ Mensagem enviada:', messageResponse.data);
            } catch (error) {
                console.error('❌ Erro ao enviar mensagem:', error.message);
            }
        }

    } catch (error) {
        console.error('❌ Erro no exemplo:', error.message);
        if (error.response) {
            console.error('📄 Resposta do servidor:', error.response.data);
        }
    }
}

// Executar exemplo
if (require.main === module) {
    exemploPairingCode();
}

module.exports = { exemploPairingCode }; 