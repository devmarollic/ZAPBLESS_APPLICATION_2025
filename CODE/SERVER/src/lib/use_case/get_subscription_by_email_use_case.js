// -- IMPORTS

import { ZodError } from 'zod';
import { subscriptionService } from '../service/subscription_service';
import { z } from 'zod';

// -- CONSTANTS

const emailSchema = z.object(
    {
        email: z.string().email()
    }
    );

// -- TYPES

class GetSubscriptionByEmailUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, data, error } = await emailSchema.safeParseAsync( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let subscription = await subscriptionService.getSubscriptionByEmail( data.email );

        return subscription;
    }
}

export const getSubscriptionByEmailUseCase = new GetSubscriptionByEmailUseCase(); 