// -- IMPORTS

import { DashboardPageController } from '../controller/dashboard_page_controller';

// -- CONSTANTS

const dashboardPageController = new DashboardPageController();

// -- FUNCTIONS

export async function dashboardRoutes(
    fastify,
    options
    )
{
    fastify.get(
        '/get',
        ( request, response ) => dashboardPageController.handle( request, response )
        );
}

