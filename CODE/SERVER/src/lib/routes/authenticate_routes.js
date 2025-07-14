// -- IMPORTS

import { AuthenticateController } from '../controller/authenticate_controller';
import { RefreshTokenController } from '../controller/refresh_token_controller';
import { SendOtpController } from '../controller/send_otp_controller';
import { VerifyOtpController } from '../controller/verify_otp_controller';
import { GoogleLoginController } from '../controller/google_login_controller';
import { GoogleCallbackController } from '../controller/google_callback_controller';
import { UpdatePasswordController } from '../controller/update_password_controller';
import { ResetPasswordController } from '../controller/reset_password_controller';
import { ExchangeCodeController } from '../controller/exchange_code_controller';

// -- CONSTANTS

const authenticateController = new AuthenticateController();
const refreshTokenController = new RefreshTokenController();
const sendOtpController = new SendOtpController();
const verifyOtpController = new VerifyOtpController();
const googleLoginController = new GoogleLoginController();
const googleCallbackController = new GoogleCallbackController();
const updatePasswordController = new UpdatePasswordController();
const resetPasswordController = new ResetPasswordController();
const exchangeCodeController = new ExchangeCodeController();

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

    fastify.post(
        '/update-password',
        ( request, response ) => updatePasswordController.handle( request, response )
        );

    fastify.post(
        '/reset-password',
        ( request, response ) => resetPasswordController.handle( request, response )
        );

    fastify.get(
        '/exchange-code',
        ( request, response ) => exchangeCodeController.handle( request, response )
        );
}

