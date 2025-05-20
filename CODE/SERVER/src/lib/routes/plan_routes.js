// -- IMPORTS

import { ListPlansController } from '../controller/list_plans_controller';

// -- CONSTANTS

const listPlansController = new ListPlansController();

// -- FUNCTIONS

export async function planRoutes(
    fastify,
    options,
    done
    )
{
    fastify.get(
        '/list',
        ( request, response ) => listPlansController.handle( request, response )
        );

    done();
}

