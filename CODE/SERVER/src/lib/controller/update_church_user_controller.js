// -- IMPORTS

import { Controller } from '../controller/controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { isNullOrUndefined } from '../../base';
import { updateChurchUserUseCase } from '../use_case/update_church_user_use_case';
import { roleValidationService } from '../service/role_validation_service';

// -- TYPES

export class UpdateChurchUserController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let profileId = profileLogged.id;
        let churchId = profileLogged.user_metadata.church_id;

        await roleValidationService.validateUserIsAdministrator(
            profileId,
            churchId
            );

        let { userId } = request.params;
        let {
            firstName,
            lastName,
            phonePrefix,
            phoneNumber,
            role,
            statusId
        } = request.body;

        let updatedUser = await updateChurchUserUseCase.execute(
            {
                userId,
                churchId,
                firstName,
                lastName,
                phonePrefix,
                phoneNumber,
                role,
                statusId
            }
            );

        return updatedUser;
    }
} 