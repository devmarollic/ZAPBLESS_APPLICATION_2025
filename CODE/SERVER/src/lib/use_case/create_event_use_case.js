// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { eventSchema } from '../model/event';
import { scheduleSchema } from '../model/schedule';
import { eventService } from '../service/event_service';
import { scheduleService } from '../service/schedule_service';
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
        let { success: eventSuccess, error: eventError, data: eventData } = eventSchema.safeParse( input );

        if ( !eventSuccess )
        {
            return eventError;
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
                ...eventData
            }
            );

        if ( input.schedule )
        {
            let { success: scheduleSuccess, error: scheduleError, data: scheduleData } = scheduleSchema.safeParse( {
                ...input.schedule,
                churchId: profile.churchId,
                eventId: event.id,
                statusId: 'pending'
            } );

            if ( !scheduleSuccess )
            {
                await eventService.deleteEvent( event.id );
                return scheduleError;
            }

            let schedule = await scheduleService.addSchedule(
                {
                    id: getRandomTuid(),
                    ...scheduleData
                }
                );

            event.schedule = schedule;
        }

        return event;
    }
}

export const createEventUseCase =
    new CreateEventUseCase();