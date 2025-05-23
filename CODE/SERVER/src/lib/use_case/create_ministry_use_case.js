// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { ministrySchema } from '../model/ministry';
import { ministryService } from '../service/ministry_service';
import { profileService } from '../service/profile_service';

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
            throw new AppError( 'Church not found', 404 );
        }

        let ministry = await ministryService.addMinistry(
            {
                id: getRandomTuid(),
                ...data
            }
            );

        return ministry;
    }
}

export const createMinistryUseCase = new CreateMinistryUseCase(); 