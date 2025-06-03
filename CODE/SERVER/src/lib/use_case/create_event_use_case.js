// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { eventSchema } from '../model/event';
import { eventService } from '../service/event_service';
import { profileService } from '../service/profile_service';
import { AppError } from '../errors/app_error';

// -- TYPES

class CreateEventUseCase
{
    // -- OPERATIONS

    async execute(
        input,
        userId
        )
    {
        let { success, error, data } = eventSchema.safeParse( input );

        if ( !success )
        {
            return error;
        }

        let profile = await profileService.getProfileById( userId );

        if ( !profile )
        {
            throw new AppError( 'Profile not found', 404 );
        }

        let event = await eventService.addEvent(
            {
                id: getRandomTuid(),
                churchId: profile.churchId,
                ...data
            }
            );

        return event;
    }
}

export const createEventUseCase = new CreateEventUseCase();