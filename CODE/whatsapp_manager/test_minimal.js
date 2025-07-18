// -- IMPORTS

import { AuthStateProvider } from './auth_state_provider.js';
import { ProviderFiles } from './provider_file_service.js';
import { clearSession } from './clear_session.js';

// -- CONSTANTS

const TEST_INSTANCE = 'test-instance';

// -- FUNCTIONS

async function testMinimal(
    )
{
    console.log( 'Testing minimal WhatsApp setup...' );
    
    try
    {
        // Limpa a sessão existente
        await clearSession( TEST_INSTANCE );
        
        let providerFiles = new ProviderFiles();
        let authStateProvider = new AuthStateProvider( providerFiles );
        
        // Testa a criação do auth state
        let authState = await authStateProvider.authStateProvider( TEST_INSTANCE );
        
        if ( !authState )
        {
            console.error( '❌ AuthState creation failed' );
            return false;
        }
        
        console.log( '✅ AuthState created successfully' );
        
        // Testa a leitura das credenciais
        let creds = authState.state.creds;
        
        if ( !creds )
        {
            console.error( '❌ Credentials not found' );
            return false;
        }
        
        console.log( '✅ Credentials loaded successfully' );
        console.log( 'Creds keys:', Object.keys( creds ) );
        
        // Testa a escrita das credenciais
        try
        {
            await authState.saveCreds();
            console.log( '✅ Credentials saved successfully' );
        }
        catch ( error )
        {
            console.error( '❌ Error saving credentials:', error );
            return false;
        }
        
        // Testa a leitura de chaves que não existem (deve retornar undefined sem erro)
        try
        {
            let nonExistentKey = await authState.state.keys.get( 'session', ['test-key'] );
            console.log( '✅ Non-existent key read successfully (returned undefined)' );
        }
        catch ( error )
        {
            console.error( '❌ Error reading non-existent key:', error );
            return false;
        }
        
        console.log( '✅ All tests passed!' );
        return true;
    }
    catch ( error )
    {
        console.error( '❌ Test failed:', error );
        return false;
    }
}

// -- STATEMENTS

testMinimal()
    .then( ( success ) =>
        {
            if ( success )
            {
                console.log( '🎉 All tests completed successfully!' );
                process.exit( 0 );
            }
            else
            {
                console.log( '💥 Tests failed!' );
                process.exit( 1 );
            }
        }
        )
    .catch( ( error ) =>
        {
            console.error( '💥 Unexpected error:', error );
            process.exit( 1 );
        }
        ); 