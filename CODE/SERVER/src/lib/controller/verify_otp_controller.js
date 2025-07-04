// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { verifyOtpUseCase } from '../use_case/verify_otp_use_case';

// -- TYPES

export class VerifyOtpController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        let { email, otp } = request.body;

        let { user, session } = await verifyOtpUseCase.execute( { email, otp } );

        response.status( StatusCodes.OK ).send( { user, session } );
    }
}