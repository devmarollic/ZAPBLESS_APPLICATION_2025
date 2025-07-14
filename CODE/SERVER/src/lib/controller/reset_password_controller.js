// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { resetPasswordUseCase } from '../use_case/reset_password_use_case';

// -- TYPES

export class ResetPasswordController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {

        let { email } = request.body;

        await resetPasswordUseCase.execute( { email } );

        response.status( StatusCodes.OK ).send(
            {
                success: true,
                message: 'Password reset email sent successfully'
            }
            );
    }
}
