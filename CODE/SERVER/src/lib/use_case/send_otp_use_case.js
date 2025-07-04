// -- IMPORTS

import { z, ZodError } from 'zod';
import { authentificationService } from '../service/authentification_service';

// -- CONSTANTS

const emailSchema = z.object(
    {
        email: z.string().email()
    }
    );

// -- TYPES

class SendOtpUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { error, data, success } = await emailSchema.safeParseAsync( input );

        if ( !success )
        {
            throw new Error( `Invalid email format: ${error.errors[0].message}` );
        }

        let { email } = data;

        let otp = await authentificationService.sendOtp( email );

        return otp;
    }
}

// -- VARIABLES

export const sendOtpUseCase = new SendOtpUseCase();