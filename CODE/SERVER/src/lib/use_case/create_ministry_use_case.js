// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { ministrySchema } from '../model/ministry';
import { ministryService } from '../service/ministry_service';
import { profileService } from '../service/profile_service';
import { AppError } from '../errors/app_error';

// -- TYPES

class CreateMinistryUseCase
{
    // -- OPERATIONS

    async execute(
        input,
        userId
        )
    {
        let { success, error, data } = ministrySchema.safeParse( input );

        if ( !success )
        {
            return error;
        }

        let profile = await profileService.getProfileById( userId );

        if ( !profile )
        {
            throw new AppError( 'Profile not found', 404 );
        }

        let ministry = await ministryService.addMinistry(
            {
                id: getRandomTuid(),
                churchId: profile.churchId,
                ...data
            }
            );

        return ministry;
    }
}

export const createMinistryUseCase = new CreateMinistryUseCase(); 