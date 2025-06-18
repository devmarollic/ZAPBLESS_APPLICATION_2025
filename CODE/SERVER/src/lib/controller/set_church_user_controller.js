// -- IMPORTS

import { Controller } from './controller';
import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { setChurchUserUseCase } from '../use_case/set_church_user_use_case';

// -- TYPES

export class SetChurchUserController extends Controller
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

        let { profileId } = request.params;
        let churchId = profileLogged.user_metadata.church_id;

        let churchUser = await setChurchUserUseCase.execute(
            {
                ...request.body,
                profileId,
                churchId
            }
            );

        return churchUser;
    }
}
