// -- IMPORTS

import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fs from 'fs';
import path from 'path';
import { supabaseService } from './lib/service/supabase_service';
import
    {
        churchRoutes,
        profileRoutes,
        whatsappRoutes,
        authenticateRoutes,
        planRoutes,
        ministryRoutes,
        eventRoutes,
        dashboardRoutes,
        subscriptionRoutes,
        eventTypesRoutes
    } from './lib/routes';
import { initIO } from './socket';
import { authMiddleware } from './middleware/auth_middleware';
import { errorMiddleware } from './middleware/error_middleware';
import { scheduleWorker } from './lib/worker/schedule_worker';
import { logError } from 'senselogic-gist';
import { enviroment } from './enviroment';

// -- STATEMENTS

let fastify = Fastify( { logger: true } );

fastify.register(
    fastifyCors,
    {
        origin: enviroment.FRONTEND_URL,
        credentials: true,
        methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS' ],
        allowedHeaders: [ 'Content-Type', 'Authorization', 'ngrok-skip-browser-warning' ]
    }
    );

fastify.register(
    fastifyStatic,
    {
        root : path.join( __dirname, 'public' ),
        prefix : '/',
        decorateReply: false
    }
    );

fastify.register(
    fastifyStatic,
    {
        root : path.join( __dirname, 'public/admin' ),
        prefix : '/admin/'
    }
    );

fastify.addHook( 'onRequest', authMiddleware );
fastify.setErrorHandler( errorMiddleware );

fastify.register( churchRoutes, { prefix: '/church' } );
fastify.register( profileRoutes, { prefix: '/profile' } );
fastify.register( planRoutes, { prefix: '/plan' } );
fastify.register( authenticateRoutes, { prefix: '/login' } );
fastify.register( whatsappRoutes, { prefix: '/whatsapp' } );
fastify.register( ministryRoutes, { prefix: '/ministry' } );
fastify.register( eventRoutes, { prefix: '/event' } );
fastify.register( dashboardRoutes, { prefix: '/dashboard' } );
fastify.register( subscriptionRoutes, { prefix: '/subscriptions' } );
fastify.register( eventTypesRoutes, { prefix: '/event-type' } );

fastify.setNotFoundHandler(
    async ( request, reply ) =>
    {
        let htmlFileName;

        if ( request.url === '/admin'
             || request.url.startsWith( '/admin/' ) )
        {
            htmlFileName = 'public/admin/index.html';
        }
        else
        {
            htmlFileName = 'public/index.html';
        }

        let htmlFilePath = path.join( __dirname, htmlFileName );
        let htmlFileContent = fs.readFileSync( htmlFilePath, 'utf8' );

        reply.type( 'text/html' ).send( htmlFileContent );
    }
    );

let start =
    async () =>
    {
        supabaseService.getClient();

        try
        {
            
            await fastify.listen( { port : enviroment.PORT, host : '0.0.0.0' } );
        }
        catch ( error )
        {
            fastify.log.error( error );

            process.exit( 1 );
        }
    };

fastify.ready(
    async err =>
    {
        if ( err )
        {
            throw err;
        }
        else
        {
            start();
        }
    }
    );

initIO( fastify.server );

scheduleWorker
    .start()
    .catch(
        ( error ) =>
        {
            logError( error );
            process.exit( 1 );
        }
        );