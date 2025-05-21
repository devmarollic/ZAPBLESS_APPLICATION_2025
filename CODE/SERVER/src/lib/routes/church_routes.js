// -- IMPORTS

import { ChurchController } from '../controller/church_controller';

// -- CONSTANTS

const churchController = new ChurchController();

// -- FUNCTIONS

export async function churchRoutes(
    fastify,
    options
    )
{
    fastify.post(
        '/add',
        ( request, response ) => churchController.handle( request, response )
        );
}

