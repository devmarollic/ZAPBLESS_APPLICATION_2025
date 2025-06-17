// -- IMPORTS

import { GetEventTypeArrayController } from '../controller/get_event_type_array_controller';

// -- CONSTANTS

const getEventTypeArrayController = new GetEventTypeArrayController();

// -- FUNCTIONS

export async function eventTypesRoutes(
    fastify,
    options
    )
{
    fastify.get(
        '/list',
        ( request, response ) => getEventTypeArrayController.handle( request, response )
        );
} 