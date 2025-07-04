// -- IMPORTS

import { AuthenticateController } from '../controller/authenticate_controller';
import { RefreshTokenController } from '../controller/refresh_token_controller';
import { SendOtpController } from '../controller/send_otp_controller';
import { VerifyOtpController } from '../controller/verify_otp_controller';
import { GoogleLoginController } from '../controller/google_login_controller';
import { GoogleCallbackController } from '../controller/google_callback_controller';

// -- CONSTANTS

const authenticateController = new AuthenticateController();
const refreshTokenController = new RefreshTokenController();
const sendOtpController = new SendOtpController();
const verifyOtpController = new VerifyOtpController();
const googleLoginController = new GoogleLoginController();
const googleCallbackController = new GoogleCallbackController();

// -- FUNCTIONS

export async function authenticateRoutes(
    fastify,
    options
    )
{
    fastify.post(
        '/',
        ( request, response ) => authenticateController.handle( request, response )
        );

    fastify.post(
        '/refresh-token',
        ( request, response ) => refreshTokenController.handle( request, response )
        );

    fastify.post(
        '/send-otp',
        ( request, response ) => sendOtpController.handle( request, response )
        );

    fastify.post(
        '/verify-otp',
        ( request, response ) => verifyOtpController.handle( request, response )
        );
    
    fastify.get(
        '/google',
        ( request, response ) => googleLoginController.handle( request, response )
        );

    fastify.post(
        '/google/callback',
        ( request, response ) => googleCallbackController.handle( request, response )
        );
}

