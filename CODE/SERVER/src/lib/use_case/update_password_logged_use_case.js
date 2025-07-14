// -- IMPORTS

import { z, ZodError } from 'zod';
import { authentificationService } from '../service/authentification_service';

// -- CONSTANTS

const updatePasswordSchema = z.object(
    {
        currentPassword: z.string().min(1),
        newPassword: z.string().min(6),
        user: z.object({
            email: z.string().email(),
            id: z.string()
        })
    }
);

// -- TYPES

class UpdatePasswordLoggedUseCase
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

        let { currentPassword, newPassword, user } = data;

        let loginResult = await authentificationService.signInUser( user.email, currentPassword );

        if ( !loginResult || !loginResult.session )
        {
            throw new AppError( 'Invalid credentials' );
        }

        let result = await authentificationService.updateUserPassword( loginResult.session.access_token, newPassword );

        return result;
    }
}

// -- VARIABLES

export let updatePasswordLoggedUseCase = new UpdatePasswordLoggedUseCase();
