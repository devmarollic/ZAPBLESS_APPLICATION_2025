// -- IMPORTS

import { ListScheduleController } from '../controller/list_schedule_controller';
import { DeleteScheduleController } from '../controller/delete_schedule_controller';
import { UpdateScheduleStatusController } from '../controller/update_schedule_status_controller';

// -- CONSTANTS

const listScheduleController = new ListScheduleController();
const deleteScheduleController = new DeleteScheduleController();
const updateScheduleStatusController = new UpdateScheduleStatusController();

// -- FUNCTIONS

export async function scheduleRoutes(
    fastify,
    options
    )
{
    fastify.get(
        '/list',
        ( request, response ) => listScheduleController.handle( request, response )
        );

    fastify.delete(
        '/:id',
        ( request, response ) => deleteScheduleController.handle( request, response )
        );

    fastify.put(
        '/:id/status',
        ( request, response ) => updateScheduleStatusController.handle( request, response )
        );
} 