// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { eventSchema } from '../model/event';
import { scheduleSchema, scheduleStatus } from '../model/schedule';
import { eventService } from '../service/event_service';
import { scheduleService } from '../service/schedule_service';
import { profileService } from '../service/profile_service';
import { AppError } from '../errors/app_error';

// -- TYPES

class ScheduleEventUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = scheduleSchema.safeParse( input );

        if ( !success )
        {
            return error;
        }

        let event = await eventService.getEventById( data.eventId );

        if ( !event )
        {
            throw new AppError( 'Event not found', 404 );
        }

        let churchId = data.churchId ?? event.churchId;

        if ( !churchId )
        {
            throw new AppError( 'churchId is required' );
        }

        let newSchedule = await scheduleService.addSchedule(
            {
                id: getRandomTuid(),
                ...data,
                churchId,
                statusId: scheduleStatus.pending
            }
            );

        if ( !newSchedule )
        {
            throw new AppError( 'Failed to schedule notification' );
        }

        return newSchedule;
    }
}

// -- VARIABLES

export const scheduleEventUseCase =
    new ScheduleEventUseCase();