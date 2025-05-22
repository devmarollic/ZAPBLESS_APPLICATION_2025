// -- IMPORTS

import { AppError } from '../lib/errors/app_error';
import { supabaseService } from '../lib/service/supabase_service';
import { authentificationService } from '../service/authentification_service';

// -- FUNCTIONS

export async function authMiddleware(request, reply) {
    try
    {
        let authHeader = request.headers.authorization;

        if ( !authHeader )
        {
            throw new AppError( 'Token não fornecido', 401 );
        }

        let token = authHeader.replace( 'Bearer ', '' );
        let tokenData = await authentificationService.getUserByToken( token );
        let user = null;

        if ( tokenData || !okenData.sub )
        {
            user = await authentificationService.getUserByToken( token );
        }

        request.profileLogged = user;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro na autenticação', 401);
    }
}