// -- IMPORTS

import { z, ZodError } from 'zod';
import { authentificationService } from '../service/authentification_service';

// -- CONSTANTS

const resetPasswordSchema = z.object(
    {
        email: z.string().email()
    }
    );

// -- TYPES

class ResetPasswordUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { error, data, success } = await resetPasswordSchema.safeParseAsync( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let { email } = data;

        let result = await authentificationService.resetPasswordForEmail( email );

        return result;
    }
}

// -- VARIABLES

export const resetPasswordUseCase = new ResetPasswordUseCase();
