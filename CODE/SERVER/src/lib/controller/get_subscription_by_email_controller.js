// -- IMPORTS

import { Controller } from './controller';
import { getSubscriptionByEmailUseCase } from '../use_case/get_subscription_by_email_use_case';

// -- TYPES

export class GetSubscriptionByEmailController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { email } = request.params;

        let subscription = await getSubscriptionByEmailUseCase.execute( { email } );

        return (
            {
                id: subscription.id,
                churchId: subscription.churchId,
                planId: subscription.planId
            }
            );
    }
} 