// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { sendOtpUseCase } from '../use_case/send_otp_use_case';

// -- TYPES

export class SendOtpController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        try
        {
            let { email } = request.body;

            let otp = await sendOtpUseCase.execute( { email } );

            response.status( StatusCodes.OK ).send( { 
                success: true, 
                message: 'OTP sent successfully',
                otp 
            } );
        }
        catch ( error )
        {
            response.status( StatusCodes.INTERNAL_SERVER_ERROR ).send( {
                success: false,
                message: error.message || 'Failed to send OTP',
                error: error.code || 'UNKNOWN_ERROR'
            } );
        }
    }
}