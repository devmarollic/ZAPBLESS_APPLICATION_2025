// -- IMPORTS

import { z, ZodError } from 'zod';
import { scheduleService } from '../service/schedule_service';
import { AppError } from '../errors/app_error';

// -- CONSTANTS

const deleteScheduleSchema = z.object(
    {
        scheduleId: z.string(),
        churchId: z.string()
    }
    );

// -- TYPES

class DeleteScheduleUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = deleteScheduleSchema.safeParse( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let schedule = await scheduleService.getScheduleById( data.scheduleId );

        if ( !schedule )
        {
            throw new AppError( 'Schedule not found', 404 );
        }

        if ( schedule.churchId !== data.churchId )
        {
            throw new AppError( 'Schedule does not belong to this church', 403 );
        }

        let isDeleted = await scheduleService.deleteScheduleById( data.scheduleId );

        if ( !isDeleted )
        {
            throw new AppError( 'Failed to delete schedule' );
        }

        return (
            {
                message: 'Schedule deleted successfully'
            }
            );
    }
}

// -- VARIABLES

export let deleteScheduleUseCase =
    new DeleteScheduleUseCase(); 