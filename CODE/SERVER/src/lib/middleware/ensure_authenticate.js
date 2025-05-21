// -- IMPORTS

import { AppError } from '../lib/errors/app_error';
import { supabaseService } from '../lib/service/supabase_service';
import { authentificationService } from '../service/authentification_service';

// -- FUNCTIONS

export async function authMiddleware(request, reply) {
    try
    {
        const authHeader = request.headers.authorization;

        if ( !authHeader )
        {
            throw new AppError( 'Token não fornecido', 401 );
        }

        const token = authHeader.replace( 'Bearer ', '' );
        const tokenData = await authentificationService.getUserByToken( token );

        if ( !tokenData || !tokenData.sub )
        {
            throw new AppError( 'Token inválido', 401 );
        }

        const user = await authentificationService.getUserByToken( token );

        if ( !user )
        {
            throw new AppError( 'Usuário não encontrado', 401 );
        }

        request.profileLogged = user;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro na autenticação', 401);
    }
}