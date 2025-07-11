// -- IMPORTS

import { z, ZodError } from 'zod';
import { scheduleService } from '../service/schedule_service';

// -- CONSTANTS

const listScheduleSchema = z.object({
    churchId: z.string()
});

// -- TYPES

class ListScheduleUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = listScheduleSchema.safeParse( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let scheduleArray = await scheduleService.getScheduleArrayWithDetails(
            input.churchId
            );

        return scheduleArray;
    }
}

// -- VARIABLES

export let listScheduleUseCase = new ListScheduleUseCase(); 