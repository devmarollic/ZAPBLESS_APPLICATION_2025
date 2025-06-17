// -- IMPORTS

import { subscriptionService } from '../service/subscription_service';
import { z, ZodError } from 'zod';
import { AppError } from '../errors/app_error';

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

        // -- CASO NÃO EXISTA SUBSCRIPTION, CLIENTE PRECISA SELECIONAR UMA NOVA ASSINATURA

        if ( subscription === null )
        {
            throw new AppError( 'SUBSCRIPTION_NOT_FOUND' );
        }

        return subscription;
    }
}

export const getSubscriptionByEmailUseCase = new GetSubscriptionByEmailUseCase(); 