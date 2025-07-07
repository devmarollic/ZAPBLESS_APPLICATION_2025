// -- IMPORTS

import { Controller } from '../controller/controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { isNullOrUndefined } from '../../base';
import { listChurchUsersWithFiltersUseCase } from '../use_case/list_church_users_with_filters_use_case';
import { roleValidationService } from '../service/role_validation_service';

// -- TYPES

export class ListChurchUsersWithFiltersController extends Controller
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

        let { 
            searchTerm,
            statusFilter,
            roleFilter,
            page = 1,
            limit = 10
        } = request.query;

        let result = await listChurchUsersWithFiltersUseCase.execute(
            {
                churchId,
                searchTerm,
                statusFilter,
                roleFilter,
                page: parseInt( page, 10 ),
                limit: parseInt( limit, 10 )
            }
            );

        return result;
    }
} 