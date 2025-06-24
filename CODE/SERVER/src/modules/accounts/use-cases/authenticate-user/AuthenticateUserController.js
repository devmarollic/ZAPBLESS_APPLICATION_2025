// -- IMPORTS

import { createLogger } from '../../../../utils/logger.js';
import { AppError } from '../../../../shared/errors/app_error.js';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase.js';

// -- VARIABLES

const logger = createLogger( 'AUTHENTICATE_USER_CONTROLLER' );

// -- FUNCTIONS

class AuthenticateUserController
{
    constructor()
    {
        this.authenticateUserUseCase = new AuthenticateUserUseCase();
    }
    
    async handle( request, reply )
    {
        try
        {
            const { email, password } = request.body;
            
            const result = await this.authenticateUserUseCase.execute( { email, password } );
            
            return {
                success: true,
                message: 'Login realizado com sucesso',
                data: result
            };
        }
        catch ( error )
        {
            if ( error instanceof AppError )
            {
                throw error;
            }
            
            logger.logError( error, 'Authenticate user controller' );
            throw AppError.internal( 'Erro interno no controlador de autenticação' );
        }
    }
}

// -- STATEMENTS

export { AuthenticateUserController }; 