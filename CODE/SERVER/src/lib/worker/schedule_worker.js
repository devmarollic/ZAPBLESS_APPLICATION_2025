// -- IMPORTS

import { logError } from 'senselogic-gist';
import { scheduleService } from '../service/schedule_service';
import { notificationService } from '../service/notification_service';

// -- TYPES

class ScheduleWorker
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.isRunning = false;
        this.interval = 60000;
    }

    // -- OPERATIONS

    async start(
        )
    {
        if ( this.isRunning )
        {
            return;
        }

        this.isRunning = true;
        this.processSchedules();
    }

    // ~~

    async stop(
        )
    {
        this.isRunning = false;
    }

    // ~~

    async processSchedules(
        )
    {
        while ( this.isRunning )
        {
            try
            {
                let now = new Date();
                let schedules = await scheduleService.getPendingSchedules( now );

                for ( let schedule of schedules )
                {
                    try
                    {
                        await notificationService.sendNotification( schedule );

                        await scheduleService.setScheduleById(
                            {
                                statusId: 'sent',
                                updateTimestamp: now.toISOString()
                            },
                            schedule.id
                            );
                    }
                    catch ( error )
                    {
                        logError( error );

                        await scheduleService.setScheduleById(
                            {
                                statusId: 'failed',
                                errorMessage: error.message,
                                updateTimestamp: now.toISOString()
                            },
                            schedule.id
                            );
                    }
                }
            }
            catch ( error )
            {
                logError( error );
            }

            await new Promise( resolve => setTimeout( resolve, this.interval ) );
        }
    }
}

// -- VARIABLES

export const scheduleWorker =
    new ScheduleWorker(); 