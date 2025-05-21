// -- IMPORTS

import { AuthenticateController } from '../controller/authenticate_controller';

// -- CONSTANTS

const authenticateController = new AuthenticateController();

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
}

