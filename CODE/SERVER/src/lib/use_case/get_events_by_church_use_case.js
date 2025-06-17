// -- IMPORTS

import { eventService } from '../service/event_service';
import { profileService } from '../service/profile_service';
import { AppError } from '../errors/app_error';

// -- TYPES

class GetEventsByChurchUseCase
{
    // -- OPERATIONS

    async execute(
        userId
        )
    {
        let profile = await profileService.getProfileWithChurchById( userId );

        if ( !profile )
        {
            throw new AppError( 'Profile not found', 404 );
        }

        let events = await eventService.getEventArrayByChurchId(
            profile.churchId
            );

        return events;
    }
}

export const getEventsByChurchUseCase = new GetEventsByChurchUseCase(); 