// -- IMPORTS

import { ministryService } from '../service/ministry_service';
import { profileService } from '../service/profile_service';
import { AppError } from '../errors/app_error';

// -- TYPES

class GetMinistriesByChurchUseCase
{
    // -- OPERATIONS

    async execute(
        userId
        )
    {
        let profile = await profileService.getProfileById( userId );

        if ( !profile )
        {
            throw new AppError( 'Profile not found', 404 );
        }

        let ministries = await ministryService.getMinistriesByChurchId(
            profile.churchId
            );

        return ministries;
    }
}

export const getMinistriesByChurchUseCase = new GetMinistriesByChurchUseCase(); 