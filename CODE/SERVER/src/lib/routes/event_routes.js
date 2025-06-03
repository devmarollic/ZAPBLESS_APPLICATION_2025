// -- IMPORTS

import { EventController } from '../controller/event_controller';
import { GetEventsByChurchController } from '../controller/get_events_by_church_controller';

// -- CONSTANTS

const eventController = new EventController();
const getEventsByChurchController = new GetEventsByChurchController();

// -- FUNCTIONS

export async function eventRoutes(
    fastify,
    options
    )
{
    fastify.post(
        '/add',
        ( request, response ) => eventController.handle( request, response )
        );

    fastify.get(
        '/list',
        ( request, response ) => getEventsByChurchController.handle( request, response )
        );
} 