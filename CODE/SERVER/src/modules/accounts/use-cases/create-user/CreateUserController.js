// -- IMPORTS

import { createLogger } from '../../../../utils/logger.js';
import { AppError } from '../../../../shared/errors/app_error.js';
import { CreateUserUseCase } from './CreateUserUseCase.js';

// -- VARIABLES

const logger = createLogger( 'CREATE_USER_CONTROLLER' );

// -- FUNCTIONS

class CreateUserController
{
    constructor()
    {
        this.createUserUseCase = new CreateUserUseCase();
    }
    
    async handle( request, reply )
    {
        try
        {
            const userData = request.body;
            
            const result = await this.createUserUseCase.execute( userData );
            
            return {
                success: true,
                message: result.session 
                    ? 'Cadastro realizado com sucesso'
                    : 'Cadastro realizado com sucesso. Verifique seu email para confirmar a conta.',
                data: result
            };
        }
        catch ( error )
        {
            if ( error instanceof AppError )
            {
                throw error;
            }
            
            logger.logError( error, 'Create user controller' );
            throw AppError.internal( 'Erro interno no controlador de criação de usuário' );
        }
    }
}

// -- STATEMENTS

export { CreateUserController }; 