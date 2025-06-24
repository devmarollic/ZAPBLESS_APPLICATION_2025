// -- IMPORTS

import { createLogger } from '../utils/logger.js';
import { AppError } from '../shared/errors/app_error.js';
import { authMiddleware } from '../shared/middleware/auth_middleware.js';
import { AuthenticateUserController } from '../modules/accounts/use-cases/authenticate-user/AuthenticateUserController.js';
import { CreateUserController } from '../modules/accounts/use-cases/create-user/CreateUserController.js';

// -- VARIABLES

const logger = createLogger( 'AUTH_ROUTES' );

// -- FUNCTIONS

async function authRoutes( server )
{
    // Initialize controllers
    const authenticateUserController = new AuthenticateUserController();
    const createUserController = new CreateUserController();
    
    // Login endpoint
    server.post( '/login', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 }
                },
                required: ['email', 'password']
            }
        }
    }, async ( request, reply ) => {
        return await authenticateUserController.handle( request, reply );
    });
    
    // Register endpoint
    server.post( '/register', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    name: { type: 'string', minLength: 2 },
                    churchName: { type: 'string', minLength: 2 }
                },
                required: ['email', 'password', 'name']
            }
        }
    }, async ( request, reply ) => {
        return await createUserController.handle( request, reply );
    });
    
    // Profile endpoint (protected)
    server.get( '/profile', {
        preHandler: authMiddleware
    }, async ( request, reply ) => {
        try
        {
            logger.info( 'Profile access', { userId: request.user?.id } );
            
            return {
                success: true,
                data: {
                    user: request.user
                }
            };
        }
        catch ( error )
        {
            logger.logError( error, 'Profile endpoint' );
            throw AppError.internal( 'Erro interno no perfil' );
        }
    });
    
    logger.info( 'Auth routes registered successfully' );
}

// -- STATEMENTS

export { authRoutes }; 