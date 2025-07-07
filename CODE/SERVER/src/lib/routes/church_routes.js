// -- IMPORTS

import { ChurchController } from '../controller/church_controller';
import { GetChurchMemberArrayController } from '../controller/get_church_member_array_controller';
import { AddChurchUserController } from '../controller/add_church_user_controller';
import { ListChurchUserController } from '../controller/list_church_user_controller';
import { SetChurchUserController } from '../controller/set_church_user_controller';
import { UpdateChurchController } from '../controller/update_church_controller';

// -- CONSTANTS

const churchController = new ChurchController();
const getChurchMemberArrayController = new GetChurchMemberArrayController();
const addChurchUserController = new AddChurchUserController();
const listChurchUserController = new ListChurchUserController();
const setChurchUserController = new SetChurchUserController();
const updateChurchController = new UpdateChurchController();

// -- FUNCTIONS

export async function churchRoutes(
    fastify,
    options
    )
{
    fastify.post(
        '/add',
        ( request, response ) => churchController.handle( request, response )
        );
    
    fastify.get(
        '/members/list',
        ( request, response ) => getChurchMemberArrayController.handle( request, response )
        );

    fastify.post(
        '/user/add',
        ( request, response ) => addChurchUserController.handle( request, response )
        );

    fastify.get(
        '/user/list',
        ( request, response ) => listChurchUserController.handle( request, response )
        );

    fastify.put(
        '/user/:profileId/set',
        ( request, response ) => setChurchUserController.handle( request, response )
        );

    fastify.put(
        '/update',
        ( request, response ) => updateChurchController.handle( request, response )
        );
}

