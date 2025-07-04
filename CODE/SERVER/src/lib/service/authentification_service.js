// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { enviroment } from '../../enviroment';
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

    // ~~~

    async refreshToken(
        refreshToken
        )
    {
        let { data, error } =  await supabaseService.getClient()
            .auth
            .refreshSession(
                  {
                      refresh_token: refreshToken
                  }
                  );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~~

    async sendOtp(
        email
        )
    {
        let { data, error } = await supabaseService.getClient()
            .auth
            .signInWithOtp(
                {
                    email,
                    options:
                        {
                            emailRedirectTo: enviroment.FRONTEND_URL
                        }
                }
                );

        if ( error !== null )
        {
            logError( error );

            throw new AppError( 'Failed to send OTP' );
        }

        return data;
    }

    // ~~

    async verifyOtp(
        {
            email,
            otp
        }
        )
    {
        let { data, error } = await supabaseService.getClient()
            .auth
            .verifyOtp(
                {
                    email: email,
                    token: otp,
                    type: 'email'
                }
            );

        if ( error !== null )
        {
            logError( error );

            throw new AppError( 'Failed to verify OTP' );
        }

        return (
            {
                user: data.user,
                session: data.session
            }
            );
    }
}

// -- VARIABLES

export let authentificationService
    = new AuthentificationService();
