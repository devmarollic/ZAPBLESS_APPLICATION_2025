// -- IMPORTS

import { SyncWhatsappController } from '../controller/sync_whatsapp_controller';
import { WebhookWhatsappController } from '../controller/webhook_whatsapp_controller';
import { MessageWhatsappController } from '../controller/message_whatsapp_controller';

// -- CONSTANTS

const syncWhatsappController = new SyncWhatsappController();
const webhookWhatsappController = new WebhookWhatsappController();
const messageWhatsappController = new MessageWhatsappController();

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

    fastify.post(
        '/webhook',
        ( request, reply ) => webhookWhatsappController.handle( request, reply )
        )

    fastify.post(
        '/message',
        ( request, reply ) => messageWhatsappController.handle( request, reply )
        )
}

