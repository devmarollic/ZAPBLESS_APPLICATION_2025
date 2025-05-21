// -- IMPORTS

import { verify } from 'jsonwebtoken';
import { AppError } from '../lib/errors/app_error';
import { UnauthenticatedError } from '../lib/errors/unauthenticated_error';
import { createServerClient } from '@supabase/ssr';
import { logError } from 'senselogic-gist';
import { supabaseService } from '../lib/service/supabase_service';

// -- FUNCTIONS

export async function authMiddleware(
    request,
    reply
    )
{
    try
    {
        let authorizationHeader = request.headers.authorization;
        let [ _, token ] = authorizationHeader.split( ' ' );

        let client = supabaseService.getClient();
        let { data, error } = await client.auth.getUser( token );
    
        if ( error !== null )
        {
            logError( error );
        }

        request.profileLogged = data.user;
    }
    catch
    {
        request.profileLogged = null;
    }
} 