// -- IMPORTS

import { ZodError } from 'zod';
import { updateProfileSchema } from '../model/profile';
import { profileService } from '../service/profile_service';

// -- TYPES

class UpdateProfileUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = await updateProfileSchema.safeParseAsync( input.profileData );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let currentProfile = await profileService.getProfileById( input.profileId );

        if ( !currentProfile )
        {
            throw new Error( 'PROFILE_NOT_FOUND' );
        }

        let updatedData = { ...data };

        if ( data.firstName || data.lastName )
        {
            let firstName = data.firstName || currentProfile.firstName;
            let lastName = data.lastName || currentProfile.lastName;

            updatedData.legalName = [ firstName, lastName ]
                .filter( Boolean )
                .join( ' ' );
        }

        let updatedProfile = await profileService.setProfileById(
            updatedData,
            input.profileId
            );

        return updatedProfile;
    }
}

// -- VARIABLES

export let updateProfileUseCase
    = new UpdateProfileUseCase(); 