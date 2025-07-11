// -- IMPORTS

import { z, ZodError } from 'zod';
import { scheduleService } from '../service/schedule_service';
import { scheduleStatus } from '../model/schedule';
import { AppError } from '../errors/app_error';

// -- CONSTANTS

const updateScheduleStatusSchema = z.object(
    {
        scheduleId: z.string(),
        statusId: z.enum( [ scheduleStatus.pending, scheduleStatus.sent, scheduleStatus.failed ] ),
        churchId: z.string(),
        errorMessage: z.string().optional()
    }
    );

// -- TYPES

class UpdateScheduleStatusUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = updateScheduleStatusSchema.safeParse( input );

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

        let updateData = {
            statusId: data.statusId,
            updateTimestamp: new Date().toISOString()
        };

        if ( data.errorMessage )
        {
            updateData.errorMessage = data.errorMessage;
        }

        let updatedSchedule = await scheduleService.setScheduleById(
            updateData,
            data.scheduleId
            );

        if ( !updatedSchedule )
        {
            throw new AppError( 'Failed to update schedule status' );
        }

        return updatedSchedule;
    }
}

// -- VARIABLES

export let updateScheduleStatusUseCase =
    new UpdateScheduleStatusUseCase(); 