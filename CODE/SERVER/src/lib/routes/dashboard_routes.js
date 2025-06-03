// -- IMPORTS

import { HomePageController } from '../controller/home_page_controller';

// -- CONSTANTS

const homePageController = new HomePageController();

// -- FUNCTIONS

export async function dashboardRoutes(
    fastify,
    options
    )
{
    fastify.get(
        '/get',
        ( request, response ) => homePageController.processRequest( request, response )
        );
}

