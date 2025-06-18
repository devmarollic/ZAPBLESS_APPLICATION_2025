// -- IMPORTS

import { Controller } from '../controller/controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { isNullOrUndefined } from '../../base';
import { listChurchUserUseCase } from '../use_case/list_church_user_use_case';

// -- TYPES

export class ListChurchUserController extends Controller
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

        let churchUserArray = await listChurchUserUseCase.execute(
            {
                churchId
            }
            );

        return churchUserArray;
    }
}