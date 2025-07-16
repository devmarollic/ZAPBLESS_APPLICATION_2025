// -- IMPORTS

import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
        eventTypesRoutes,
        templateRoutes,
        scheduleRoutes,
        cityRoutes
    } from './lib/routes';
import { initIO } from './socket';
import { authMiddleware } from './middleware/auth_middleware';
import { errorMiddleware } from './middleware/error_middleware';
import { scheduleWorker } from './lib/worker/schedule_worker';
import { logError } from 'senselogic-gist';
import { enviroment } from './enviroment';
import { subscriptionStatus } from './lib/model/subscription';
import { subscriptionService } from './lib/service/subscription_service';

// -- STATEMENTS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let fastify = Fastify( { logger: true } );

fastify.register(
    fastifyCors,
    {
        origin: enviroment.FRONTEND_URL,
        credentials: true,
        allowedHeaders: [ 'Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials' ],
        methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS' ]
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
fastify.register( templateRoutes, { prefix: '/message-template' } );
fastify.register( scheduleRoutes, { prefix: '/schedule' } );
fastify.register( cityRoutes, { prefix: '/city' } );

fastify.addHook(
    'preHandler',
    ( request, reply, done ) =>
    {
        supabaseService.getClient( request, reply );
        
        done();
    }
    );

fastify.post( '/webhook', async ( request, reply ) =>
    {
        let relevantEventSet = new Set( [ 'billing.paid' ] );

        let data = request.body.data;
        let billing = data.billing;
        let eventType = request.body.event;

        if ( relevantEventSet.has( eventType ) )
        {
            switch ( eventType )
            {
                case 'billing.paid':
                    let subscriptionId = billing.products[ 0 ].externalId;
                    await subscriptionService.setSubscriptionById(
                        {
                            paymentGatewayId: billing.id,
                            paymentMethodId: 'pix',
                            chargeInfo: data,
                            price: billing.amount / 100,
                            statusId: subscriptionStatus.paid
                        },
                        subscriptionId
                        );

                    break;

                default:
                    console.log( 'Evento não relevante' );
                    break;
            }
        }
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