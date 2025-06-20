// -- IMPORTS

import { scheduleService } from '../service/schedule_service';
import { notificationService } from '../service/notification_service';
import { evolutionService } from '../service/evolution_service';

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
                let scheduleArray = await scheduleService.getPendingSchedules( now );

                for ( let schedule of scheduleArray )
                {
                    try
                    {
                        // await notificationService.sendNotification( schedule );
                        let { payload } = schedule;

                        let response = await evolutionService.sendTextByIntanceNameAndNumber( schedule.churchId, payload.number, payload.text );

                        await scheduleService.setScheduleById(
                            {
                                statusId: 'sent'
                            },
                            schedule.id
                            );
                    }
                    catch ( error )
                    {
                        console.trace();
                        console.error( error );

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
                console.trace();
                console.error( error );
            }

            await new Promise( resolve => setTimeout( resolve, this.interval ) );
        }
    }
}

// -- VARIABLES

export const scheduleWorker =
    new ScheduleWorker(); 