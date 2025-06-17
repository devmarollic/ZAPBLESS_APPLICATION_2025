// -- IMPORTS

import { GetSubscriptionByEmailController } from '../controller/get_subscription_by_email_controller';
import { PaySubscriptionController } from '../controller/pay_subscription_controller';
import { AddSubscriptionController } from '../controller/add_subscription_controller';

// -- CONSTANTS

const getSubscriptionByEmailController = new GetSubscriptionByEmailController();
const paySubscriptionController = new PaySubscriptionController();
const addSubscriptionController = new AddSubscriptionController();

// -- FUNCTIONS

export async function subscriptionRoutes(
    fastify,
    options
    )
{
    fastify.get(
        '/email/:email',
        ( request, response ) => getSubscriptionByEmailController.handle( request, response )
        );

    fastify.post(
        '/:subscriptionId/payment',
        ( request, response ) => paySubscriptionController.handle( request, response )
        );

    fastify.post(
        '/:email/add',
        ( request, response ) => addSubscriptionController.handle( request, response )
        );
}

