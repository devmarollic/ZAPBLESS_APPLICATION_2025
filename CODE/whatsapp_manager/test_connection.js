// -- IMPORTS

import { AuthStateProvider } from './auth_state_provider.js';
import { ProviderFiles } from './provider_file_service.js';
import { clearSession } from './clear_session.js';

// -- FUNCTIONS

async function testConnection(
    )
{
    console.log( 'Testing WhatsApp Connection...' );
    
    try
    {
        // Limpa a sessão existente
        await clearSession( '1' );
        
        let providerFiles = new ProviderFiles();
        let authStateProvider = new AuthStateProvider( providerFiles );
        
        // Testa a criação do auth state
        let authState = await authStateProvider.authStateProvider( '1' );
        
        if ( !authState )
        {
            console.error( '❌ AuthState creation failed' );
            return false;
        }
        
        console.log( '✅ AuthState created successfully' );
        
        // Simula o que o Baileys faz durante a conexão
        console.log( '🔍 Testing key access patterns...' );
        
        // Testa acesso a chaves que podem não existir (comum durante inicialização)
        let sessionKeys = await authState.state.keys.get( 'session', ['5512981606045.0'] );
        console.log( '✅ Session keys accessed (may be empty):', Object.keys( sessionKeys ) );
        
        let preKeys = await authState.state.keys.get( 'pre-key', ['0'] );
        console.log( '✅ Pre-keys accessed (may be empty):', Object.keys( preKeys ) );
        
        let appStateKeys = await authState.state.keys.get( 'app-state-sync-key', ['1'] );
        console.log( '✅ App state keys accessed (may be empty):', Object.keys( appStateKeys ) );
        
        // Testa escrita de algumas chaves
        console.log( '📝 Testing key writing...' );
        
        await authState.state.keys.set( {
            'session': {
                '5512981606045.0': { test: 'data' }
            }
        } );
        console.log( '✅ Session key written' );
        
        await authState.state.keys.set( {
            'pre-key': {
                '0': { test: 'data' }
            }
        } );
        console.log( '✅ Pre-key written' );
        
        // Testa leitura novamente
        let sessionKeysAfter = await authState.state.keys.get( 'session', ['5512981606045.0'] );
        console.log( '✅ Session keys read after write:', Object.keys( sessionKeysAfter ) );
        
        let preKeysAfter = await authState.state.keys.get( 'pre-key', ['0'] );
        console.log( '✅ Pre-keys read after write:', Object.keys( preKeysAfter ) );
        
        // Testa remoção de chaves
        console.log( '🗑️ Testing key removal...' );
        
        await authState.state.keys.set( {
            'session': {
                '5512981606045.0': null
            }
        } );
        console.log( '✅ Session key removed' );
        
        let sessionKeysAfterRemoval = await authState.state.keys.get( 'session', ['5512981606045.0'] );
        console.log( '✅ Session keys after removal:', Object.keys( sessionKeysAfterRemoval ) );
        
        console.log( '🎉 All connection tests passed!' );
        console.log( '📊 No ENOENT errors should appear above this message.' );
        return true;
    }
    catch ( error )
    {
        console.error( '❌ Test failed:', error );
        return false;
    }
}

// -- STATEMENTS

// Executa o teste se o script for chamado diretamente
if ( import.meta.url === `file://${process.argv[1]}` )
{
    testConnection();
}

export { testConnection }; 