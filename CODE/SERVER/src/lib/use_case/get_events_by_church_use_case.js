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
        let profile = await profileService.getProfileById( userId );

        if ( !profile )
        {
            throw new AppError( 'Profile not found', 404 );
        }

        let events = await eventService.getEventsByChurchId(
            profile.churchId
            );

        return events;
    }
}

export const getEventsByChurchUseCase = new GetEventsByChurchUseCase(); 