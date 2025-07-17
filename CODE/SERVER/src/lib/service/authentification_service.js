// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { enviroment } from '../../enviroment';
import { AppError } from '../errors/app_error';
import { ConflictError } from '../errors/conflict_error';
import { churchService } from './church_service';

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
            if ( error.code === 'user_already_exists' )
            {
                await churchService.removeChurchById( data.church_id );
                throw new ConflictError( 'Usuário já existe' );
            }

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

    // ~~~

    async googleLogin(
        )
    {
        let { data, error } = await supabaseService.getClient()
            .auth
            .signInWithOAuth(
                {
                    provider: 'google',
                    options:
                        {
                            redirectTo: enviroment.FRONTEND_URL + '/auth/callback'
                        }
                }
            );

        if ( error !== null )
        {
            logError( error );

            throw new AppError( 'Failed to login with Google' );
        }

        return data.url;
    }

    // ~~

    async googleCallback(
        code
        )
    {
        let { data, error } = await supabaseService.getClient()
            .auth
            .exchangeCodeForSession( code );

        if ( error !== null )
        {
            logError( error );

            throw new AppError( 'Failed to process Google login' );
        }

        return (
            {
                user: data.user,
                session: data.session
            }
            );
    }

    // ~~

    async removeUserById(
        id
        )
    {
        let { data, error } = await supabaseService.getClient()
            .auth
            .admin
            .deleteUser( id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~~

    async resetPasswordForEmail(
        email
        )
    {
        let { data, error } = await supabaseService.getClient().auth.resetPasswordForEmail(
            email,
            {
                redirectTo: enviroment.FRONTEND_URL + '/reset-password'
            }
            );

        if ( error !== null )
        {
            logError( error );
            throw new AppError( 'Failed to send password reset email' );
        }

        return data;
    }

    // ~~~

    async exchangeCodeForSession(
        code
        )
    {
        let client = supabaseService.getClient();
        let { data, error } = await client.auth.exchangeCodeForSession( code );

        if ( error !== null )
        {
            logError( error );
            throw new AppError( 'Failed to exchange code for session' );
        }

        return data;
    }

    // ~~

    async updateUserPassword(
        accessToken,
        newPassword
        )
    {
        let client = supabaseService.getClient();

        let { data: user, error: userError } = await client.auth.getUser( accessToken );

        if ( userError !== null )
        {
            logError( userError );
            throw new AppError( 'Failed to authenticate session for password update' );
        }

        let { data, error } = await client.auth.updateUser( { password: newPassword } );

        if ( error !== null )
        {
            logError( error );
            throw new AppError( 'Failed to update password' );
        }

        return data;
    }
}

// -- VARIABLES

export let authentificationService
    = new AuthentificationService();
