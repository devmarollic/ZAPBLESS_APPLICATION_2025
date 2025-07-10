// -- IMPORTS

import { ListMessageTemplateController } from '../controller/list_message_template_controller';
import { ListMessageTemplateCategoryController } from '../controller/list_message_template_category_controller';
import { CreateMessageTemplateController } from '../controller/create_message_template_controller';
import { SetMessageTemplateController } from '../controller/set_message_template_controller';
import { RemoveMessageTemplateController } from '../controller/remove_message_template_controller';

// -- CONSTANTS

const listMessageTemplateController = new ListMessageTemplateController();
const listMessageTemplateCategoryController = new ListMessageTemplateCategoryController();
const createMessageTemplateController = new CreateMessageTemplateController();
const setMessageTemplateController = new SetMessageTemplateController();
const removeMessageTemplateController = new RemoveMessageTemplateController();

// -- FUNCTIONS

export async function templateRoutes(
    fastify,
    options
    )
{
    fastify.get(
        '/list',
        ( request, response ) => listMessageTemplateController.handle( request, response )
        );

    fastify.post(
        '/add',
        ( request, response ) => createMessageTemplateController.handle( request, response )
        );

    fastify.put(
        '/:id/set',
        ( request, response ) => setMessageTemplateController.handle( request, response )
        );

    fastify.delete(
        '/:id/remove',
        ( request, response ) => removeMessageTemplateController.handle( request, response )
        );

    fastify.get(
        '/category/list',
        ( request, response ) => listMessageTemplateCategoryController.handle( request, response )
        );
}

