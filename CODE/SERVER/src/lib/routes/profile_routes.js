// -- IMPORTS

import { ProfileController } from '../controller/profile_controller';
import { GetChurchAndProfileDataController } from '../controller/get_church_and_profile_data_controller';

// -- CONSTANTS

const profileController = new ProfileController();
const getChurchAndProfileDataController = new GetChurchAndProfileDataController();

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
        '/church-data',
        ( request, reply ) => getChurchAndProfileDataController.handle( request, reply )
        );
}

