// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { AppError } from '../errors/app_error';

// -- TYPES

class AuthentificationService
{
    // -- INQUIRIES

    getClient(
        )
    {
        return supabaseService.getClient();
    }

    // -- OPERATIONS

    async signUpUser(
        email,
        password,
        data = {}
        )
    {
        let { user, error } =
            await supabaseService.getClient().auth.signUp(
                  {
                        email,
                        password,
                        options:
                            {
                                data
                            }
                  }
                  );


        if ( error !== null )
        {
            logError( error );
        }

        return user;
    }

    // ~~

    async signInUser(
        email,
        password
        )
    {
        let { data, error } =
            await supabaseService.getClient().auth.signInWithPassword(
                  {
                      email,
                      password
                  }
                  );

        if ( error !== null )
        {
            logError( error );

            throw new AppError( error.code, error.status );
        }

        return data;
    }

    // ~~

    async signOutUser(
        )
    {
        let { error } =
            await supabaseService.getClient().auth.signOut();

        if ( error !== null )
        {
            logError( error );
        }
    }
}

// -- VARIABLES

export let authentificationService
    = new AuthentificationService();
