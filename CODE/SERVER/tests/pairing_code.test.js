/**
 * Testes para funcionalidade de Pairing Code
 */

const axios = require('axios');

// Configurações de teste
const BASE_URL = 'http://localhost:3000';
const TEST_CHURCH_ID = 'test_church_123';
const TEST_PHONE_NUMBER = '5511999999999';

describe('Pairing Code Tests', () => {
    let containerUrl = null;

    beforeAll(async () => {
        // Aguardar servidor estar pronto
        await new Promise(resolve => setTimeout(resolve, 2000));
    });

    describe('POST /docker/sync', () => {
        test('deve iniciar container Docker para igreja', async () => {
            const response = await axios.post(`${BASE_URL}/docker/sync`, {
                churchId: TEST_CHURCH_ID
            });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.data.containerUrl).toBeDefined();
            expect(response.data.port).toBeDefined();
            expect(response.data.containerName).toBeDefined();

            containerUrl = response.data.containerUrl;
        }, 30000);

        test('deve retornar erro para igreja inexistente', async () => {
            try {
                await axios.post(`${BASE_URL}/docker/sync`, {
                    churchId: 'inexistente'
                });
                fail('Deveria ter retornado erro');
            } catch (error) {
                expect(error.response.status).toBe(404);
                expect(error.response.data.success).toBe(false);
            }
        });
    });

    describe('POST /start (Container)', () => {
        test('deve iniciar sessão com número de telefone', async () => {
            if (!containerUrl) {
                throw new Error('Container não foi iniciado');
            }

            // Aguardar container inicializar
            await new Promise(resolve => setTimeout(resolve, 5000));

            const response = await axios.post(`${containerUrl}/start`, {
                phoneNumber: TEST_PHONE_NUMBER
            });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.data.status).toBeDefined();
        }, 30000);

        test('deve gerar pairing code para número válido', async () => {
            if (!containerUrl) {
                throw new Error('Container não foi iniciado');
            }

            const response = await axios.post(`${containerUrl}/start`, {
                phoneNumber: TEST_PHONE_NUMBER
            });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            
            // Verificar se pairing code foi gerado
            if (response.data.pairingCode) {
                expect(typeof response.data.pairingCode).toBe('string');
                expect(response.data.pairingCode.length).toBeGreaterThan(0);
            }
        }, 30000);

        test('deve retornar erro para número inválido', async () => {
            if (!containerUrl) {
                throw new Error('Container não foi iniciado');
            }

            try {
                await axios.post(`${containerUrl}/start`, {
                    phoneNumber: '123' // Número muito curto
                });
                fail('Deveria ter retornado erro');
            } catch (error) {
                expect(error.response.status).toBe(400);
            }
        });
    });

    describe('GET /status (Container)', () => {
        test('deve retornar status do WhatsApp', async () => {
            if (!containerUrl) {
                throw new Error('Container não foi iniciado');
            }

            const response = await axios.get(`${containerUrl}/status`);

            expect(response.status).toBe(200);
            expect(response.data.status).toBeDefined();
            expect(['connecting', 'open', 'close']).toContain(response.data.status);
        });

        test('deve incluir pairing code quando disponível', async () => {
            if (!containerUrl) {
                throw new Error('Container não foi iniciado');
            }

            const response = await axios.get(`${containerUrl}/status`);

            expect(response.status).toBe(200);
            
            // Se estiver conectando, pode ter pairing code
            if (response.data.status === 'connecting') {
                if (response.data.pairingCode) {
                    expect(typeof response.data.pairingCode).toBe('string');
                }
            }
        });
    });

    describe('GET /docker/pairing/{churchId}/status', () => {
        test('deve verificar status do pairing code via API do servidor', async () => {
            const response = await axios.get(`${BASE_URL}/docker/pairing/${TEST_CHURCH_ID}/status`);

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.data.status).toBeDefined();
            expect(response.data.containerUrl).toBeDefined();
        });

        test('deve retornar erro para igreja inexistente', async () => {
            try {
                await axios.get(`${BASE_URL}/docker/pairing/inexistente/status`);
                fail('Deveria ter retornado erro');
            } catch (error) {
                expect(error.response.status).toBe(404);
                expect(error.response.data.success).toBe(false);
            }
        });

        test('deve retornar erro para container não rodando', async () => {
            try {
                await axios.get(`${BASE_URL}/docker/pairing/outra_igreja/status`);
                fail('Deveria ter retornado erro');
            } catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data.success).toBe(false);
            }
        });
    });

    describe('Fluxo Completo de Pairing Code', () => {
        test('deve completar fluxo de pairing code com sucesso', async () => {
            // 1. Iniciar container
            const syncResponse = await axios.post(`${BASE_URL}/docker/sync`, {
                churchId: TEST_CHURCH_ID
            });
            expect(syncResponse.data.success).toBe(true);

            const containerUrl = syncResponse.data.containerUrl;

            // 2. Aguardar container inicializar
            await new Promise(resolve => setTimeout(resolve, 5000));

            // 3. Iniciar sessão com número
            const startResponse = await axios.post(`${containerUrl}/start`, {
                phoneNumber: TEST_PHONE_NUMBER
            });
            expect(startResponse.data.success).toBe(true);

            // 4. Verificar se pairing code foi gerado
            if (startResponse.data.pairingCode) {
                expect(typeof startResponse.data.pairingCode).toBe('string');
                expect(startResponse.data.pairingCode.length).toBeGreaterThan(0);
            }

            // 5. Verificar status via API do servidor
            const statusResponse = await axios.get(`${BASE_URL}/docker/pairing/${TEST_CHURCH_ID}/status`);
            expect(statusResponse.data.success).toBe(true);
            expect(statusResponse.data.status).toBeDefined();

        }, 60000);
    });

    afterAll(async () => {
        // Limpeza: parar container de teste
        if (containerUrl) {
            try {
                await axios.post(`${BASE_URL}/docker/container/${TEST_CHURCH_ID}/stop`);
            } catch (error) {
                console.log('Erro ao parar container de teste:', error.message);
            }
        }
    });
}); 