// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { updatePasswordLoggedUseCase } from '../use_case/update_password_logged_use_case';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- TYPES

export class UpdatePasswordLoggedController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        let { currentPassword, newPassword } = request.body;
        let profileLogged = request.profileLogged;

        if ( !profileLogged )
        {
            throw new UnauthenticatedError();
        }

        await updatePasswordLoggedUseCase.execute( { currentPassword, newPassword, user: profileLogged } );

        response.status( StatusCodes.OK ).send(
            {
                success: true,
                message: 'Password updated successfully'
            }
            );
    }
}
