// -- IMPORTS

import dotenv from 'dotenv';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fs from 'fs';
import path from 'path';
import { HomePageController } from './lib/controller/home_page_controller';
import { PropertiesPageController } from './lib/controller/properties_page_controller';
import { PropertyPageController } from './lib/controller/property_page_controller';
import { supabaseService } from './lib/service/supabase_service';
import { churchRoutes, profileRoutes, whatsappRoutes, authenticateRoutes, planRoutes, ministryRoutes, eventRoutes, dashboardRoutes } from './lib/routes';
import { initIO } from './socket';
import { authMiddleware } from './middleware/auth_middleware';
import { errorMiddleware } from './middleware/error_middleware';
import { whatsappBotManager } from './lib/service/whatsapp_bot_manager';

// -- STATEMENTS

dotenv.config(
    {
        path: '.env'
    }
    );

let fastify = Fastify( { logger: true } );

fastify.register(
    fastifyCors,
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
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

let homePageController = new HomePageController();
let propertiesPageController = new PropertiesPageController();
let propertyPageController = new PropertyPageController();

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

fastify.post(
    '/api/page/home',
    async ( request, reply ) =>
    {
        return await homePageController.processRequest( request, reply );
    }
    );

fastify.post(
    '/api/page/properties',
    async ( request, reply ) =>
    {
        return await propertiesPageController.processRequest( request, reply );
    }
    );

fastify.post(
    '/api/page/property/:id',
    async ( request, reply ) =>
    {
        return await propertyPageController.processRequest( request, reply );
    }
    );

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
            whatsappBotManager.initializeAllSessions();
            
            await fastify.listen( { port : 8000, host : '0.0.0.0' } );
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