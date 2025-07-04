// -- IMPORTS

import { AuthenticateController } from '../controller/authenticate_controller';
import { RefreshTokenController } from '../controller/refresh_token_controller';
import { SendOtpController } from '../controller/send_otp_controller';
import { VerifyOtpController } from '../controller/verify_otp_controller';

// -- CONSTANTS

const authenticateController = new AuthenticateController();
const refreshTokenController = new RefreshTokenController();
const sendOtpController = new SendOtpController();
const verifyOtpController = new VerifyOtpController();

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
}

