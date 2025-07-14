// -- IMPORTS

import { z, ZodError } from 'zod';
import { authentificationService } from '../service/authentification_service';

// -- CONSTANTS

const updatePasswordSchema = z.object(
    {
        accessToken: z.string().min(10),
        newPassword: z.string().min(6)
    }
    );

// -- TYPES

class UpdatePasswordUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { error, data, success } = await updatePasswordSchema.safeParseAsync( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let { accessToken, newPassword } = data;

        let result = await authentificationService.updateUserPassword( accessToken, newPassword );

        return result;
    }
}

// -- VARIABLES

export const updatePasswordUseCase = new UpdatePasswordUseCase();
