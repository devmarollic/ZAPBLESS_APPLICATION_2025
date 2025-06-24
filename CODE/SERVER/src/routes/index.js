// -- IMPORTS

import { createLogger } from '../utils/logger.js';

// -- VARIABLES

const logger = createLogger( 'ROUTES' );

// -- FUNCTIONS

async function routeExists( routeFile )
{
    try
    {
        // Try to dynamically import the route file
        await import( `./${routeFile}` );
        return true;
    }
    catch ( error )
    {
        // If import fails, the file doesn't exist or has errors
        return false;
    }
}

async function registerRoute( server, routeFile, prefix, routeExportName )
{
    try
    {
        if ( await routeExists( routeFile ) )
        {
            const { [routeExportName]: routeFunction } = await import( `./${routeFile}` );
            
            if ( routeFunction )
            {
                await server.register( routeFunction, { prefix } );
                logger.info( `Route registered: ${prefix}` );
            }
            else
            {
                logger.warn( `Route export '${routeExportName}' not found in ${routeFile}` );
            }
        }
        else
        {
            logger.debug( `Route file ${routeFile} not found, skipping...` );
        }
    }
    catch ( error )
    {
        logger.logError( error, `Failed to register route ${prefix}` );
    }
}

async function setupRoutes( server )
{
    try
    {
        // List of routes to register
        const routes = [
            { file: 'auth_routes.js', prefix: '/api/auth', export: 'authRoutes' },
            { file: 'church_routes.js', prefix: '/api/church', export: 'churchRoutes' },
            { file: 'profile_routes.js', prefix: '/api/profile', export: 'profileRoutes' },
            { file: 'plan_routes.js', prefix: '/api/plan', export: 'planRoutes' },
            { file: 'whatsapp_routes.js', prefix: '/api/whatsapp', export: 'whatsappRoutes' },
            { file: 'ministry_routes.js', prefix: '/api/ministry', export: 'ministryRoutes' },
            { file: 'event_routes.js', prefix: '/api/event', export: 'eventRoutes' },
            { file: 'dashboard_routes.js', prefix: '/api/dashboard', export: 'dashboardRoutes' },
            { file: 'subscription_routes.js', prefix: '/api/subscription', export: 'subscriptionRoutes' }
        ];
        
        // Register each route if it exists
        for ( const route of routes )
        {
            await registerRoute( server, route.file, route.prefix, route.export );
        }
        
        // Health check route
        server.get( '/health', async ( request, reply ) => {
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                version: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development'
            };
        });
        
        // API info route
        server.get( '/api', async ( request, reply ) => {
            return {
                name: 'ZapBless API',
                version: process.env.npm_package_version || '1.0.0',
                description: 'Church management platform API',
                endpoints: [
                    '/health',
                    '/api',
                    '/api/auth',
                    '/api/church',
                    '/api/profile',
                    '/api/plan',
                    '/api/whatsapp',
                    '/api/ministry',
                    '/api/event',
                    '/api/dashboard',
                    '/api/subscription'
                ]
            };
        });
        
        logger.info( 'Routes setup completed successfully' );
    }
    catch ( error )
    {
        logger.logError( error, 'Route setup' );
        throw error;
    }
}

// -- STATEMENTS

export { setupRoutes }; 