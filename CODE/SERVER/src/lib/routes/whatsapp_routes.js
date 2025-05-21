// -- IMPORTS

import { SyncWhatsappController } from '../controller/sync_whatsapp_controller';

// -- CONSTANTS

const syncWhatsappController = new SyncWhatsappController();

// -- FUNCTIONS

export async function whatsappRoutes(
    fastify,
    options
    )
{
    fastify.post(
        '/sync',
        ( request, reply ) => syncWhatsappController.handle( request, reply )
        );
}

