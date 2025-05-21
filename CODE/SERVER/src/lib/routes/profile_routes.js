// -- IMPORTS

import { ProfileController } from '../controller/profile_controller';

// -- CONSTANTS

const profileController = new ProfileController();

// -- FUNCTIONS

export async function profileRoutes(
    fastify,
    options
    )
{
    fastify.post(
        '/add',
        ( request, reply ) => profileController.handle( request, reply )
        );
}

