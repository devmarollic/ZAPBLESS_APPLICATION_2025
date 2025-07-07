// -- IMPORTS

import { GetSubscriptionByEmailController } from '../controller/get_subscription_by_email_controller';
import { PaySubscriptionController } from '../controller/pay_subscription_controller';
import { AddSubscriptionController } from '../controller/add_subscription_controller';
import { GetActivePlanDetailsController } from '../controller/get_active_plan_details_controller';
import { GetBillingHistoryController } from '../controller/get_billing_history_controller';
import { GetSubscriptionOverviewController } from '../controller/get_subscription_overview_controller';

// -- CONSTANTS

const getSubscriptionByEmailController = new GetSubscriptionByEmailController();
const paySubscriptionController = new PaySubscriptionController();
const addSubscriptionController = new AddSubscriptionController();
const getActivePlanDetailsController = new GetActivePlanDetailsController();
const getBillingHistoryController = new GetBillingHistoryController();
const getSubscriptionOverviewController = new GetSubscriptionOverviewController();

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

    fastify.get(
        '/church/active-plan',
        ( request, response ) => getActivePlanDetailsController.handle( request, response )
        );

    fastify.get(
        '/church/billing-history',
        ( request, response ) => getBillingHistoryController.handle( request, response )
        );

    fastify.get(
        '/church/overview',
        ( request, response ) => getSubscriptionOverviewController.handle( request, response )
        );
}

