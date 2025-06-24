// -- IMPORTS

import { ProfileController } from '../controller/profile_controller';
import { ListAllProfilesController } from '../controller/list_all_profiles_controller';

// -- CONSTANTS

const profileController = new ProfileController();
const listAllProfilesController = new ListAllProfilesController();

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

    fastify.get(
        '/list-all',
        ( request, reply ) => listAllProfilesController.handle( request, reply )
        );
}

