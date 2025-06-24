// -- IMPORTS

import { z } from 'zod';
import { createLogger } from '../../../../utils/logger.js';
import { AppError } from '../../../../shared/errors/app_error.js';
import { getSupabaseAuthClient } from '../../../../config/auth/index.js';

// -- VARIABLES

const logger = createLogger( 'AUTHENTICATE_USER_USE_CASE' );

// -- TYPES

const authenticateUserSchema = z.object(
    {
        email: z.string().email( 'Email deve ter um formato válido' ),
        password: z.string().min( 6, 'Senha deve ter pelo menos 6 caracteres' )
    }
);

// -- FUNCTIONS

class AuthenticateUserUseCase
{
    constructor()
    {
        this.supabase = getSupabaseAuthClient();
    }
    
    async execute( { email, password } )
    {
        try
        {
            // Validate input
            const validatedData = authenticateUserSchema.parse( { email, password } );
            
            logger.info( 'Authenticating user', { email: validatedData.email } );
            
            // Authenticate with Supabase
            const { data, error } = await this.supabase.auth.signInWithPassword(
                {
                    email: validatedData.email,
                    password: validatedData.password
                }
            );
            
            if ( error )
            {
                logger.warn( 'Authentication failed', { 
                    email: validatedData.email, 
                    error: error.message 
                });
                
                if ( error.message.includes( 'Invalid login credentials' ) )
                {
                    throw AppError.unauthorized( 'Email ou senha incorretos' );
                }
                
                throw AppError.unauthorized( error.message );
            }
            
            if ( !data.user || !data.session )
            {
                throw AppError.unauthorized( 'Falha na autenticação' );
            }
            
            logger.info( 'Authentication successful', { 
                userId: data.user.id, 
                email: data.user.email 
            });
            
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.name,
                    churchId: data.user.user_metadata?.church_id,
                    role: data.user.user_metadata?.role || 'member',
                    emailConfirmed: !!data.user.email_confirmed_at
                },
                session: {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    expires_at: data.session.expires_at,
                    expires_in: data.session.expires_in
                }
            };
        }
        catch ( error )
        {
            if ( error instanceof z.ZodError )
            {
                throw AppError.validation( 'Dados de autenticação inválidos', error.errors );
            }
            
            if ( error instanceof AppError )
            {
                throw error;
            }
            
            logger.logError( error, 'Authentication use case' );
            throw AppError.internal( 'Erro interno na autenticação' );
        }
    }
}

// -- STATEMENTS

export { AuthenticateUserUseCase }; 