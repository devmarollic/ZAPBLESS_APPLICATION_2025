// -- IMPORTS

import { AuthenticateController } from '../controller/authenticate_controller';
import { RefreshTokenController } from '../controller/refresh_token_controller';

// -- CONSTANTS

const authenticateController = new AuthenticateController();
const refreshTokenController = new RefreshTokenController();

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
}

