// -- IMPORTS

import { Controller } from './controller';
import { paySubscriptionUseCase } from '../use_case/pay_subscription_use_case';

// -- TYPES

export class PaySubscriptionController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { subscriptionId } = request.params;
        let body = request.body;

        let subscription = await paySubscriptionUseCase.execute(
            {
                subscriptionId,
                ...body
            }
            );

        return (
            {
                subscription
            }
            );
    }
} 