// -- IMPORTS

import { Controller } from '../controller/controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { isNullOrUndefined } from '../../base';
import { deleteChurchUserUseCase } from '../use_case/delete_church_user_use_case';
import { roleValidationService } from '../service/role_validation_service';

// -- TYPES

export class DeleteChurchUserController extends Controller
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

        let deleted = await deleteChurchUserUseCase.execute(
            {
                userId,
                churchId
            }
            );

        return deleted;
    }
} 