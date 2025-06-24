// -- IMPORTS

import { z } from 'zod';
import { createLogger } from '../../../../utils/logger.js';
import { AppError } from '../../../../shared/errors/app_error.js';
import { getSupabaseAuthClient } from '../../../../config/auth/index.js';

// -- VARIABLES

const logger = createLogger( 'CREATE_USER_USE_CASE' );

// -- TYPES

const createUserSchema = z.object(
    {
        email: z.string().email( 'Email deve ter um formato válido' ),
        password: z.string().min( 6, 'Senha deve ter pelo menos 6 caracteres' ),
        name: z.string().min( 2, 'Nome deve ter pelo menos 2 caracteres' ),
        churchName: z.string().min( 2, 'Nome da igreja deve ter pelo menos 2 caracteres' ).optional()
    }
);

// -- FUNCTIONS

class CreateUserUseCase
{
    constructor()
    {
        this.supabase = getSupabaseAuthClient();
    }
    
    async execute( userData )
    {
        try
        {
            // Validate input
            const validatedData = createUserSchema.parse( userData );
            
            logger.info( 'Creating user', { email: validatedData.email } );
            
            // Register with Supabase
            const { data, error } = await this.supabase.auth.signUp(
                {
                    email: validatedData.email,
                    password: validatedData.password,
                    options: {
                        data: {
                            name: validatedData.name,
                            church_name: validatedData.churchName,
                            role: 'member'
                        }
                    }
                }
            );
            
            if ( error )
            {
                logger.warn( 'User creation failed', { 
                    email: validatedData.email, 
                    error: error.message 
                });
                
                if ( error.message.includes( 'already registered' ) )
                {
                    throw AppError.conflict( 'Este email já está cadastrado' );
                }
                
                throw AppError.validation( error.message );
            }
            
            if ( !data.user )
            {
                throw AppError.internal( 'Falha ao criar usuário' );
            }
            
            logger.info( 'User created successfully', { 
                userId: data.user.id, 
                email: data.user.email 
            });
            
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    name: validatedData.name,
                    churchName: validatedData.churchName,
                    emailConfirmed: !!data.user.email_confirmed_at
                },
                session: data.session ? {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                    expires_at: data.session.expires_at,
                    expires_in: data.session.expires_in
                } : null,
                needsEmailConfirmation: !data.session
            };
        }
        catch ( error )
        {
            if ( error instanceof z.ZodError )
            {
                throw AppError.validation( 'Dados de cadastro inválidos', error.errors );
            }
            
            if ( error instanceof AppError )
            {
                throw error;
            }
            
            logger.logError( error, 'Create user use case' );
            throw AppError.internal( 'Erro interno na criação de usuário' );
        }
    }
}

// -- STATEMENTS

export { CreateUserUseCase }; 