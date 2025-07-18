// -- IMPORTS

import { AuthStateProvider } from './auth_state_provider.js';
import { ProviderFiles } from './provider_file_service.js';
import { clearSession } from './clear_session.js';

// -- FUNCTIONS

async function testWhatsAppAuth(
    )
{
    console.log( 'Testing WhatsApp Authentication...' );
    
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
        
        // Verifica se as credenciais foram inicializadas
        if ( !authState.state.creds )
        {
            console.error( '❌ Credentials not initialized' );
            return false;
        }
        
        console.log( '✅ Credentials initialized' );
        console.log( 'Credentials structure:', Object.keys( authState.state.creds ) );
        
        // Verifica se as chaves foram inicializadas
        if ( !authState.state.keys )
        {
            console.error( '❌ Keys not initialized' );
            return false;
        }
        
        console.log( '✅ Keys initialized' );
        
        // Testa a escrita das credenciais
        await authState.saveCreds();
        console.log( '✅ Credentials saved successfully' );
        
        // Testa a leitura das credenciais
        let creds = await authState.state.keys.get( 'creds', ['creds'] );
        console.log( '✅ Credentials read successfully' );
        
        // Testa a leitura novamente para verificar se foi salvo corretamente
        let savedCreds = await authState.state.keys.get( 'creds', ['creds'] );
        console.log( '✅ Credentials read after save successfully' );
        
        // Verifica se o arquivo foi criado corretamente
        let [ response, error ] = await providerFiles.read( '1', 'creds' );
        
        if ( error )
        {
            console.error( '❌ Error reading saved credentials file:', error );
            return false;
        }
        
        if ( !response?.data )
        {
            console.error( '❌ No data in saved credentials file' );
            return false;
        }
        
        console.log( '✅ Credentials file created and readable' );
        
        // Tenta fazer parse do arquivo salvo
        try
        {
            let parsedCreds = JSON.parse( response.data );
            console.log( '✅ Credentials file parsed successfully' );
            console.log( 'Saved credentials structure:', Object.keys( parsedCreds ) );
        }
        catch ( parseError )
        {
            console.error( '❌ Error parsing saved credentials:', parseError );
            return false;
        }
        
        console.log( '🎉 All authentication tests passed!' );
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
    testWhatsAppAuth();
}

export { testWhatsAppAuth }; 