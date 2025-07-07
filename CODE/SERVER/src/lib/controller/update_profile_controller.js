// -- IMPORTS

import { Controller } from './controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { isNullOrUndefined } from '../../base';
import { updateProfileUseCase } from '../use_case/update_profile_use_case';

// -- TYPES

export class UpdateProfileController extends Controller
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

        let updatedProfile = await updateProfileUseCase.execute(
            {
                profileData: request.body,
                profileId: profileLogged.id
            }
            );

        return updatedProfile;
    }
} 