// -- IMPORTS

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { AuthStateProvider } from './auth_state_provider.js';
import { ProviderFiles } from './provider_file_service.js';
import { clearSession } from './clear_session.js';

// -- CONSTANTS

const PORT = process.env.PORT || 3002;
const TEST_INSTANCE = 'debug-instance';

// -- VARIABLES

let providerFiles = new ProviderFiles();
let authStateProvider = new AuthStateProvider( providerFiles );
let authState = null;

// -- FUNCTIONS

async function initializeWhatsApp(
    )
{
    console.log( '🔍 Starting WhatsApp initialization...' );
    
    try
    {
        // Limpa a sessão existente
        console.log( '🧹 Clearing session...' );
        await clearSession( TEST_INSTANCE );
        console.log( '✅ Session cleared' );
        
        // Cria o auth state
        console.log( '🔐 Creating auth state...' );
        authState = await authStateProvider.authStateProvider( TEST_INSTANCE );
        console.log( '✅ Auth state created' );
        
        if ( !authState )
        {
            throw new Error( 'Failed to create auth state' );
        }
        
        console.log( '✅ WhatsApp initialized successfully' );
        return true;
    }
    catch ( error )
    {
        console.error( '❌ Error initializing WhatsApp:', error );
        console.error( 'Stack trace:', error.stack );
        return false;
    }
}

// -- STATEMENTS

// Configura manipuladores para promises não tratadas ANTES de qualquer outra coisa
process.on( 'unhandledRejection', ( reason, promise ) =>
    {
        console.error( '🚨 UNHANDLED PROMISE REJECTION DETECTED!' );
        console.error( 'Reason:', reason );
        console.error( 'Promise:', promise );
        console.error( 'Stack trace:', new Error().stack );
        
        // Se o reason for um objeto, tenta extrair mais informações
        if ( reason && typeof reason === 'object' )
        {
            console.error( 'Reason type:', reason.constructor.name );
            console.error( 'Reason keys:', Object.keys( reason ) );
            
            if ( reason.message )
            {
                console.error( 'Reason message:', reason.message );
            }
            
            if ( reason.stack )
            {
                console.error( 'Reason stack:', reason.stack );
            }
        }
    }
    );

process.on( 'uncaughtException', ( error ) =>
    {
        console.error( '💥 UNCAUGHT EXCEPTION DETECTED!' );
        console.error( 'Error:', error );
        console.error( 'Stack trace:', error.stack );
        process.exit( 1 );
    }
    );

// Inicializa o servidor Express
const app = express();
app.use( cors(
    {
        origin: '*',
        methods: '*',
        allowedHeaders: '*',
        exposedHeaders: '*',
        credentials: true
    }
    ) );
app.use( bodyParser.json() );

// Rota principal
app.get( '/', ( req, res ) =>
    {
        res.json(
            {
                status: 'running',
                message: 'WhatsApp Debug Server',
                timestamp: new Date().toISOString()
            }
            );
    }
    );

// Rota de health check
app.get( '/health', ( req, res ) =>
    {
        res.json(
            {
                status: 'healthy',
                whatsapp: authState ? 'initialized' : 'not_initialized',
                timestamp: new Date().toISOString()
            }
            );
    }
    );

// Rota para inicializar WhatsApp
app.post( '/init', async ( req, res ) =>
    {
        console.log( '📥 Received /init request' );
        
        try
        {
            let success = await initializeWhatsApp();
            
            if ( success )
            {
                console.log( '✅ Initialization successful, sending response' );
                res.json(
                    {
                        success: true,
                        message: 'WhatsApp initialized successfully',
                        timestamp: new Date().toISOString()
                    }
                    );
            }
            else
            {
                console.log( '❌ Initialization failed, sending error response' );
                res.status( 500 ).json(
                    {
                        success: false,
                        message: 'Failed to initialize WhatsApp',
                        timestamp: new Date().toISOString()
                    }
                    );
            }
        }
        catch ( error )
        {
            console.error( '💥 Error in /init route:', error );
            console.error( 'Stack trace:', error.stack );
            res.status( 500 ).json(
                {
                    success: false,
                    message: 'Internal server error',
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
                );
        }
    }
    );

// Rota para obter status das credenciais
app.get( '/creds', ( req, res ) =>
    {
        console.log( '📥 Received /creds request' );
        
        try
        {
            if ( !authState )
            {
                return res.status( 400 ).json(
                    {
                        error: 'WhatsApp not initialized',
                        timestamp: new Date().toISOString()
                    }
                    );
            }
            
            let creds = authState.state.creds;
            let credsKeys = Object.keys( creds );
            
            res.json(
                {
                    success: true,
                    credsKeys: credsKeys,
                    hasCredentials: credsKeys.length > 0,
                    timestamp: new Date().toISOString()
                }
                );
        }
        catch ( error )
        {
            console.error( '💥 Error in /creds route:', error );
            console.error( 'Stack trace:', error.stack );
            res.status( 500 ).json(
                {
                    error: 'Internal server error',
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
                );
        }
    }
    );

// Rota para testar operações de chaves
app.post( '/test-keys', async ( req, res ) =>
    {
        console.log( '📥 Received /test-keys request' );
        
        try
        {
            if ( !authState )
            {
                return res.status( 400 ).json(
                    {
                        error: 'WhatsApp not initialized',
                        timestamp: new Date().toISOString()
                    }
                    );
            }
            
            // Testa operações de chaves
            console.log( '🔑 Testing key operations...' );
            
            // Testa leitura de chave que não existe
            let nonExistentKey = await authState.state.keys.get( 'session', ['test-key'] );
            console.log( '✅ Non-existent key read:', nonExistentKey );
            
            // Testa escrita de chave
            await authState.state.keys.set( { 'session': { 'test-key': 'test-value' } } );
            console.log( '✅ Key written successfully' );
            
            // Testa leitura da chave escrita
            let existingKey = await authState.state.keys.get( 'session', ['test-key'] );
            console.log( '✅ Existing key read:', existingKey );
            
            res.json(
                {
                    success: true,
                    message: 'Key operations tested successfully',
                    nonExistentKey: nonExistentKey,
                    existingKey: existingKey,
                    timestamp: new Date().toISOString()
                }
                );
        }
        catch ( error )
        {
            console.error( '💥 Error in /test-keys route:', error );
            console.error( 'Stack trace:', error.stack );
            res.status( 500 ).json(
                {
                    error: 'Internal server error',
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
                );
        }
    }
    );

// Inicia o servidor
app.listen( PORT, () =>
    {
        console.log( `🚀 Debug WhatsApp server running on port ${PORT}` );
        console.log( `📱 Test instance: ${TEST_INSTANCE}` );
        console.log( `🌐 Health check: http://localhost:${PORT}/health` );
        console.log( `🔧 Initialize: POST http://localhost:${PORT}/init` );
        console.log( `🔑 Test keys: POST http://localhost:${PORT}/test-keys` );
        console.log( `📋 Credentials: GET http://localhost:${PORT}/creds` );
    }
    );

// Configura manipuladores para encerramento gracioso
process.on( 'SIGINT', () =>
    {
        console.log( '🛑 Shutting down debug server...' );
        process.exit( 0 );
    }
    );

process.on( 'SIGTERM', () =>
    {
        console.log( '🛑 Shutting down debug server...' );
        process.exit( 0 );
    }
    ); 