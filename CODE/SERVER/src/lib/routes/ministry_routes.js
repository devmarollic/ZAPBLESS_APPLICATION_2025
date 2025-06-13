// -- IMPORTS

import { AddMinistryController } from '../controller/add_ministry_controller';
import { GetMinistriesByChurchController } from '../controller/get_ministries_by_church_controller';
import { GetMinistryByIdController } from '../controller/get_ministry_by_id_controller';
import { SetMinistryByIdController } from '../controller/set_ministry_by_id_controller';

// -- CONSTANTS

const addMinistryController = new AddMinistryController();
const getMinistriesByChurchController = new GetMinistriesByChurchController();
const getMinistryByIdController = new GetMinistryByIdController();
const setMinistryByIdController = new SetMinistryByIdController();

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
    
    fastify.get(
        '/:ministryId',
        ( request, response ) => getMinistryByIdController.handle( request, response )
        );

    fastify.put(
        '/:ministryId',
        ( request, response ) => setMinistryByIdController.handle( request, response )
        );
} 