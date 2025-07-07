// -- IMPORTS

import { Controller } from './controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { isNullOrUndefined } from '../../base';
import { updateChurchUseCase } from '../use_case/update_church_use_case';
import { roleValidationService } from '../service/role_validation_service';

// -- TYPES

export class UpdateChurchController extends Controller
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

        let churchId = profileLogged.user_metadata.church_id;

        await roleValidationService.validateUserIsAdministrator(
            profileLogged.id,
            churchId
            );

        let updatedChurch = await updateChurchUseCase.execute(
            {
                churchData: request.body,
                churchId
            }
            );

        return updatedChurch;
    }
} 