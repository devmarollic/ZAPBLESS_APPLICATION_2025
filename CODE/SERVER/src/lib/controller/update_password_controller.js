// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { updatePasswordUseCase } from '../use_case/update_password_use_case';

// -- TYPES

export class UpdatePasswordController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        let { newPassword } = request.body;
        let { access_token: accessToken } = request.query;

        await updatePasswordUseCase.execute( { newPassword, accessToken } );

        response.status( StatusCodes.OK ).send(
            {
                success: true,
                message: 'Password updated successfully'
            }
            );
    }
}
