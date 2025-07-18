// -- IMPORTS

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { AuthStateProvider } from './auth_state_provider.js';
import { ProviderFiles } from './provider_file_service.js';
import { clearSession } from './clear_session.js';

// -- CONSTANTS

const PORT = process.env.PORT || 3001;
const TEST_INSTANCE = 'test-instance';

// -- VARIABLES

let providerFiles = new ProviderFiles();
let authStateProvider = new AuthStateProvider( providerFiles );
let authState = null;

// -- FUNCTIONS

async function initializeWhatsApp(
    )
{
    try
    {
        console.log( 'Initializing WhatsApp...' );
        
        // Limpa a sessão existente
        await clearSession( TEST_INSTANCE );
        
        // Cria o auth state
        authState = await authStateProvider.authStateProvider( TEST_INSTANCE );
        
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
        return false;
    }
}

// -- STATEMENTS

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
                message: 'WhatsApp Minimal Server'
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
                whatsapp: authState ? 'initialized' : 'not_initialized'
            }
            );
    }
    );

// Rota para inicializar WhatsApp
app.post( '/init', async ( req, res ) =>
    {
        try
        {
            let success = await initializeWhatsApp();
            
            if ( success )
            {
                res.json(
                    {
                        success: true,
                        message: 'WhatsApp initialized successfully'
                    }
                    );
            }
            else
            {
                res.status( 500 ).json(
                    {
                        success: false,
                        message: 'Failed to initialize WhatsApp'
                    }
                    );
            }
        }
        catch ( error )
        {
            console.error( 'Error in /init:', error );
            res.status( 500 ).json(
                {
                    success: false,
                    message: 'Internal server error',
                    error: error.message
                }
                );
        }
    }
    );

// Rota para obter status das credenciais
app.get( '/creds', ( req, res ) =>
    {
        try
        {
            if ( !authState )
            {
                return res.status( 400 ).json(
                    {
                        error: 'WhatsApp not initialized'
                    }
                    );
            }
            
            let creds = authState.state.creds;
            let credsKeys = Object.keys( creds );
            
            res.json(
                {
                    success: true,
                    credsKeys: credsKeys,
                    hasCredentials: credsKeys.length > 0
                }
                );
        }
        catch ( error )
        {
            console.error( 'Error in /creds:', error );
            res.status( 500 ).json(
                {
                    error: 'Internal server error',
                    message: error.message
                }
                );
        }
    }
    );

// Inicia o servidor
app.listen( PORT, () =>
    {
        console.log( `🚀 Minimal WhatsApp server running on port ${PORT}` );
        console.log( `📱 Test instance: ${TEST_INSTANCE}` );
        console.log( `🌐 Health check: http://localhost:${PORT}/health` );
        console.log( `🔧 Initialize: POST http://localhost:${PORT}/init` );
    }
    );

// Configura manipuladores para encerramento gracioso
process.on( 'SIGINT', () =>
    {
        console.log( '🛑 Shutting down server...' );
        process.exit( 0 );
    }
    );

process.on( 'SIGTERM', () =>
    {
        console.log( '🛑 Shutting down server...' );
        process.exit( 0 );
    }
    );

// Configura manipulador para promises não tratadas
process.on( 'unhandledRejection', ( reason, promise ) =>
    {
        console.error( '❌ Unhandled Promise Rejection:' );
        console.error( 'Reason:', reason );
        console.error( 'Promise:', promise );
    }
    );

process.on( 'uncaughtException', ( error ) =>
    {
        console.error( '❌ Uncaught Exception:' );
        console.error( error );
        process.exit( 1 );
    }
    ); 