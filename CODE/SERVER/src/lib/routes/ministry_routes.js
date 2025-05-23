// -- IMPORTS

import { AddMinistryController } from '../controller/add_ministry_controller';

// -- CONSTANTS

const addMinistryController = new AddMinistryController();

// -- FUNCTIONS

export async function ministryRoutes(
    fastify,
    options
    )
{
    fastify.post(
        '/add',
        ( request, response ) => addMinistryController.handle( request, response )
        );
} 