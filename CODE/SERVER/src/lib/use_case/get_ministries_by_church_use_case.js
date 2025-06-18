// -- IMPORTS

import { ministryService } from '../service/ministry_service';
import { profileService } from '../service/profile_service';
import { AppError } from '../errors/app_error';

// -- TYPES

class GetMinistriesByChurchUseCase
{
    // -- OPERATIONS

    async execute(
        churchId
        )
    {
        let ministries = await ministryService.getMinistriesByChurchId(
            churchId
            );

        return ministries;
    }
}

export const getMinistriesByChurchUseCase = new GetMinistriesByChurchUseCase(); 