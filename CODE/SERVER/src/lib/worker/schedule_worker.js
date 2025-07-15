// -- IMPORTS

import { scheduleService } from '../service/schedule_service';
import { notificationService } from '../service/notification_service';
import { evolutionService } from '../service/evolution_service';
import { rabbitmqService } from '../service/rabbitmq_service.js';
import { messageTemplateService } from '../service/message_template_service.js';

// -- TYPES

class ScheduleWorker
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.isRunning = false;
        this.interval = 60000;
        this.rabbitmq = rabbitmqService;
        this.rabbitmq.connect();
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
                        let { payload } = schedule;
                        let content = '';

                        if ( payload.template )
                        {
                            let messageTemplate = await messageTemplateService.getMessageTemplateById( payload.template );
                            content = messageTemplate.content;
                        }
                        else if ( payload.customMessage )
                        {
                            content = payload.customMessage;
                        }

                        if ( content === '' )
                        {
                            throw new Error( 'Content is empty' );
                        }

                        for ( let number of payload.variables.contactNumberArray )
                        {
                            let message =
                            {
                                churchId: schedule.churchId,
                                type: 'text',
                                to: number,
                                text: content,
                                variables: payload.variables
                            };

                        await this.rabbitmq.publishOutboundMessage( message );

                        await scheduleService.setScheduleById(
                            {
                                statusId: 'sent'
                            },
                            schedule.id
                            );
                        }
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