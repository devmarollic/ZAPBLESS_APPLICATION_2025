// -- IMPORTS

import { AddMinistryController } from '../controller/add_ministry_controller';
import { GetMinistriesByChurchController } from '../controller/get_ministries_by_church_controller';

// -- CONSTANTS

const addMinistryController = new AddMinistryController();
const getMinistriesByChurchController = new GetMinistriesByChurchController();

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

    fastify.get(
        '/list',
        ( request, response ) => getMinistriesByChurchController.handle( request, response )
        );
} 