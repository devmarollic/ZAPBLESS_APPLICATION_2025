// -- IMPORTS

import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { Controller } from './controller';
import { addSubscriptionUseCase } from '../use_case/add_subscription_use_case';

// -- TYPES

export class AddSubscriptionController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { email } = request.params;
        let { body } = request;

        let subscription = await addSubscriptionUseCase.execute(
            {
                email,
                ...body
            }
            );

        return subscription;
    }
}