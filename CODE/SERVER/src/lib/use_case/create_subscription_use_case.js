// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { subscriptionSchema } from '../model/subscription';
import { subscriptionService } from '../service/subscription_service';
import { ZodError } from 'zod';

//  TYPES

class CreateSubscriptionUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = subscriptionSchema.safeParse( input );
    
        if ( !success )
        {
            throw new ZodError( error );
        }

        let subscription = await subscriptionService.addSubscription(
            {
                ...data,
                id: getRandomTuid()
            }
            );

        return subscription;
    }
}

// -- VARIABLES

export const createSubscriptionUseCase
    = new CreateSubscriptionUseCase();