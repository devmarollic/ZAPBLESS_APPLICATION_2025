// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { subscriptionSchema } from '../model/subscription';
import { subscriptionService } from '../service/subscription_service';

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
            return error;
        }

        let subscription = await subscriptionService.addSubscription( data );

        return subscription;
    }
}

// -- VARIABLES

export const createSubscriptionUseCase
    = new CreateSubscriptionUseCase();