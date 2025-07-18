// -- IMPORTS

const { validateNetworkConfig, getConnectionDiagnostics } = require('./connection_config');
const pino = require('pino');

// -- CONSTANTS

// -- TYPES

// -- VARIABLES

const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});

// -- FUNCTIONS

/**
 * Executa diagnóstico completo da conexão
 */
async function runDiagnostics() {
    console.log('🔍 Iniciando diagnóstico de conexão WhatsApp...\n');

    // 1. Informações do sistema
    console.log('📋 Informações do Sistema:');
    const diagnostics = getConnectionDiagnostics();
    console.log(`   Node.js: ${diagnostics.environment.nodeVersion}`);
    console.log(`   Plataforma: ${diagnostics.environment.platform} (${diagnostics.environment.arch})`);
    console.log(`   Uptime: ${Math.floor(diagnostics.environment.uptime / 60)} minutos`);
    console.log(`   Memória: ${Math.round(diagnostics.environment.memoryUsage.heapUsed / 1024 / 1024)}MB usado`);
    console.log('');

    // 2. Configurações de conexão
    console.log('⚙️  Configurações de Conexão:');
    console.log(`   Timeout de conexão: ${diagnostics.config.connectTimeoutMs}ms`);
    console.log(`   Timeout QR: ${diagnostics.config.qrTimeout}ms`);
    console.log(`   Keep-alive: ${diagnostics.config.keepAliveIntervalMs}ms`);
    console.log(`   Máximo tentativas: ${diagnostics.config.maxReconnectAttempts}`);
    console.log(`   Proxy: ${diagnostics.config.useProxy ? 'Habilitado' : 'Desabilitado'}`);
    console.log('');

    // 3. Validação de rede
    console.log('🌐 Testando conectividade de rede...');
    const networkValidation = await validateNetworkConfig();
    
    if (networkValidation.success) {
        console.log('   ✅ Conectividade com WhatsApp: OK');
    } else {
        console.log('   ❌ Problemas de conectividade detectados:');
        networkValidation.issues.forEach(issue => {
            console.log(`      - ${issue}`);
        });
    }
    console.log('');

    // 4. Teste de DNS
    console.log('🔍 Testando resolução DNS...');
    try {
        const dns = require('dns').promises;
        const addresses = await dns.resolve4('web.whatsapp.com');
        console.log(`   ✅ DNS resolvido: ${addresses.join(', ')}`);
    } catch (error) {
        console.log(`   ❌ Erro DNS: ${error.message}`);
    }
    console.log('');

    // 5. Teste de conectividade HTTP
    console.log('🌐 Testando conectividade HTTP...');
    try {
        const https = require('https');
        const testUrls = [
            'https://web.whatsapp.com',
            'https://g.whatsapp.com',
            'https://mmg.whatsapp.com'
        ];

        for (const url of testUrls) {
            try {
                await new Promise((resolve, reject) => {
                    const req = https.get(url, (res) => {
                        console.log(`   ✅ ${url}: HTTP ${res.statusCode}`);
                        resolve();
                    });
                    
                    req.setTimeout(10000, () => {
                        req.destroy();
                        reject(new Error('Timeout'));
                    });
                    
                    req.on('error', reject);
                });
            } catch (error) {
                console.log(`   ❌ ${url}: ${error.message}`);
            }
        }
    } catch (error) {
        console.log(`   ❌ Erro no teste HTTP: ${error.message}`);
    }
    console.log('');

    // 6. Verificação de variáveis de ambiente
    console.log('🔧 Verificando variáveis de ambiente...');
    const requiredEnvVars = ['CHURCH_ID', 'SUPABASE_URL', 'SUPABASE_KEY'];
    const optionalEnvVars = ['PROXY_HOST', 'PROXY_PORT', 'PROXY_USERNAME', 'PROXY_PASSWORD'];
    
    for (const envVar of requiredEnvVars) {
        if (process.env[envVar]) {
            console.log(`   ✅ ${envVar}: Configurado`);
        } else {
            console.log(`   ❌ ${envVar}: Não configurado`);
        }
    }
    
    for (const envVar of optionalEnvVars) {
        if (process.env[envVar]) {
            console.log(`   ⚙️  ${envVar}: Configurado`);
        }
    }
    console.log('');

    // 7. Verificação de dependências
    console.log('📦 Verificando dependências...');
    const requiredPackages = [
        '@whiskeysockets/baileys',
        'pino',
        'qrcode-terminal',
        '@supabase/supabase-js'
    ];
    
    for (const pkg of requiredPackages) {
        try {
            require.resolve(pkg);
            console.log(`   ✅ ${pkg}: Instalado`);
        } catch (error) {
            console.log(`   ❌ ${pkg}: Não encontrado`);
        }
    }
    console.log('');

    // 8. Recomendações
    console.log('💡 Recomendações:');
    if (!networkValidation.success) {
        console.log('   - Verifique sua conexão com a internet');
        console.log('   - Teste se consegue acessar web.whatsapp.com no navegador');
        console.log('   - Verifique se há firewall ou proxy bloqueando a conexão');
    }
    
    if (diagnostics.config.useProxy) {
        console.log('   - Proxy configurado, verifique se está funcionando corretamente');
    }
    
    console.log('   - Se o problema persistir, tente:');
    console.log('     * Reiniciar o serviço');
    console.log('     * Limpar a sessão (deletar pasta data)');
    console.log('     * Verificar logs para erros específicos');
    console.log('     * Testar em uma rede diferente');
    console.log('');

    console.log('✅ Diagnóstico concluído!');
}

/**
 * Testa conectividade específica
 */
async function testSpecificConnection() {
    console.log('🧪 Teste específico de conectividade...\n');
    
    try {
        const https = require('https');
        const url = 'https://web.whatsapp.com';
        
        console.log(`Conectando a ${url}...`);
        
        const response = await new Promise((resolve, reject) => {
            const req = https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        dataLength: data.length
                    });
                });
            });
            
            req.setTimeout(15000, () => {
                req.destroy();
                reject(new Error('Timeout após 15 segundos'));
            });
            
            req.on('error', reject);
        });
        
        console.log('✅ Conexão bem-sucedida!');
        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Content-Type: ${response.headers['content-type']}`);
        console.log(`   Content-Length: ${response.headers['content-length']}`);
        console.log(`   Dados recebidos: ${response.dataLength} bytes`);
        
    } catch (error) {
        console.log('❌ Erro na conexão:');
        console.log(`   ${error.message}`);
        
        if (error.code === 'ENOTFOUND') {
            console.log('   Problema de DNS - verifique sua conexão com a internet');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('   Conexão recusada - possível problema de firewall/proxy');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('   Timeout - conexão lenta ou instável');
        }
    }
}

// -- STATEMENTS

// Executa o diagnóstico se chamado diretamente
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--test-only')) {
        testSpecificConnection();
    } else {
        runDiagnostics();
    }
}

module.exports = {
    runDiagnostics,
    testSpecificConnection
}; 