// -- IMPORTS

import { z } from 'zod';
import { authentificationService } from '../service/authentification_service';

// -- CONSTANTS

const otpSchema = z.object( {
    email: z.string().email(),
    otp: z.string().length( 6 )
} );

// -- TYPES

export class VerifyOtpUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { error, data, success } = await otpSchema.safeParseAsync( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let { user, session } = await authentificationService.verifyOtp( data );

        return (
            {
                user,
                session
            }
            );
    }
}

// -- VARIABLES

export let verifyOtpUseCase = new VerifyOtpUseCase();