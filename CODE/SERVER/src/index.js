// -- IMPORTS

import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fs from 'fs';
import path from 'path';
import { environment } from './config/environment.js';
import { createLogger } from './utils/logger.js';
import { AppError } from './shared/errors/app_error.js';

// -- CONSTANTS

const SERVER_OPTIONS = {
    logger: {
        level: environment.NODE_ENV === 'development' ? 'debug' : 'info'
    }
};

const CORS_OPTIONS = {
    origin: environment.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
};

// -- VARIABLES

let fastifyServer;
const logger = createLogger( 'SERVER' );

// -- FUNCTIONS

async function setupMiddleware( server )
{
    // CORS
    await server.register( fastifyCors, CORS_OPTIONS );
    
    // Static files
    await server.register( fastifyStatic, {
        root: path.join( process.cwd(), 'public' ),
        prefix: '/',
        decorateReply: false
    });
    
    await server.register( fastifyStatic, {
        root: path.join( process.cwd(), 'public/admin' ),
        prefix: '/admin/'
    });
}

async function setupRoutes( server )
{
    // Dynamically import routes to avoid circular dependencies
    const { setupRoutes: configureRoutes } = await import( './routes/index.js' );
    
    await configureRoutes( server );
}

function setupErrorHandling( server )
{
    server.setErrorHandler( async ( error, request, reply ) => {
        const requestId = request.id || 'unknown';
        
        logger.logError( error, `Request ${requestId}` );
        
        if ( error instanceof AppError )
        {
            return reply
                .status( error.statusCode )
                .send({
                    success: false,
                    error: {
                        code: error.code,
                        message: error.message,
                        details: error.details,
                        timestamp: error.timestamp
                    }
                });
        }
        
        // Handle Zod validation errors
        if ( error.validation )
        {
            return reply
                .status( 400 )
                .send({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: error.validation,
                        timestamp: new Date().toISOString()
                    }
                });
        }
        
        // Generic error handling
        return reply
            .status( 500 )
            .send({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: environment.NODE_ENV === 'development' 
                        ? error.message 
                        : 'Internal server error',
                    timestamp: new Date().toISOString()
                }
            });
    });
}

function setupNotFoundHandler( server )
{
    server.setNotFoundHandler( async ( request, reply ) => {
        let htmlFileName;
        
        if ( request.url === '/admin' || request.url.startsWith( '/admin/' ) )
        {
            htmlFileName = 'public/admin/index.html';
        }
        else
        {
            htmlFileName = 'public/index.html';
        }
        
        try
        {
            const htmlFilePath = path.join( process.cwd(), htmlFileName );
            const htmlFileContent = fs.readFileSync( htmlFilePath, 'utf8' );
            
            return reply.type( 'text/html' ).send( htmlFileContent );
        }
        catch ( fileError )
        {
            logger.error( 'Failed to read HTML file', { fileName: htmlFileName, error: fileError.message } );
            
            return reply
                .status( 404 )
                .send({
                    success: false,
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Page not found',
                        timestamp: new Date().toISOString()
                    }
                });
        }
    });
}

async function initializeServer()
{
    try
    {
        fastifyServer = Fastify( SERVER_OPTIONS );
        
        // Add request ID for tracking
        await fastifyServer.register( async function( server ) {
            server.addHook( 'onRequest', async ( request ) => {
                request.id = `req_${Date.now()}_${Math.random().toString( 36 ).substr( 2, 9 )}`;
            });
        });
        
        await setupMiddleware( fastifyServer );
        await setupRoutes( fastifyServer );
        
        setupErrorHandling( fastifyServer );
        setupNotFoundHandler( fastifyServer );
        
        logger.info( 'Server initialized successfully' );
        
        return fastifyServer;
    }
    catch ( error )
    {
        logger.logError( error, 'Server initialization' );
        throw error;
    }
}

async function startServer()
{
    try
    {
        await fastifyServer.listen({
            port: environment.PORT,
            host: environment.HOST
        });
        
        logger.info( `Server started successfully`, {
            port: environment.PORT,
            host: environment.HOST,
            environment: environment.NODE_ENV
        });
    }
    catch ( error )
    {
        logger.logError( error, 'Server startup' );
        process.exit( 1 );
    }
}

async function setupGracefulShutdown()
{
    const signals = ['SIGINT', 'SIGTERM'];
    
    signals.forEach( signal => {
        process.on( signal, async () => {
            logger.info( `Received ${signal}, shutting down gracefully` );
            
            try
            {
                await fastifyServer.close();
                logger.info( 'Server closed successfully' );
                process.exit( 0 );
            }
            catch ( error )
            {
                logger.logError( error, 'Graceful shutdown' );
                process.exit( 1 );
            }
        });
    });
}

async function main()
{
    try
    {
        await initializeServer();
        await startServer();
        setupGracefulShutdown();
        
        // Initialize background services
        const { initializeBackgroundServices } = await import( './services/background_services.js' );
        await initializeBackgroundServices();
    }
    catch ( error )
    {
        logger.logError( error, 'Application startup' );
        process.exit( 1 );
    }
}

// -- STATEMENTS

// Handle uncaught exceptions
process.on( 'uncaughtException', ( error ) => {
    logger.logError( error, 'Uncaught exception' );
    process.exit( 1 );
});

process.on( 'unhandledRejection', ( reason, promise ) => {
    logger.error( 'Unhandled rejection', { reason, promise } );
    process.exit( 1 );
});

// Start the application
main();

export { fastifyServer };