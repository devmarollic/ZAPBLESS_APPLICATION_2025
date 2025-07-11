// -- IMPORTS

import { getRandomTuid, logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';

// -- TYPES

class ScheduleService
{
    // -- INQUIRIES

    async getScheduleById(
        id
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'SCHEDULE' )
            .select()
            .eq( 'id', id )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getScheduleArrayByEventId(
        eventId
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'SCHEDULE' )
            .select()
            .eq( 'eventId', eventId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPendingSchedules(
        now
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'SCHEDULE' )
            .select()
            .eq( 'statusId', 'pending' )
            .lte( 'scheduleAtTimestamp', now.toISOString() );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~~~

    async getScheduleArrayWithDetails(
        churchId
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'SCHEDULE' )
            .select(
                `id,
                church:CHURCH!inner(
                    id,
                    name
                ),
                event:EVENT!inner(
                    id,
                    title,
                    description,
                    ministry:MINISTRY (
                        id,
                        name,
                        color
                    ),
                    eventType:EVENT_TYPE!inner(
                        id,
                        name
                    )
                ),
                notificationType:NOTIFICATION_TYPE!inner(
                    id,
                    name
                ),
                notificationMedium:NOTIFICATION_MEDIUM!inner(
                    id,
                    name
                ),
                status:SCHEDULE_STATUS!inner(
                    id,
                    name
                ),
                recurrence:RECURRENCE!left(
                    id,
                    typeId,
                    timeOfDayTimestamp
                ),
                scheduleAtTimestamp,
                errorMessage,
                payload,
                targetRoleArray
                `
            )
            .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addSchedule(
        scheduleData
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'SCHEDULE' )
            .insert( scheduleData )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setScheduleById(
        schedule,
        id
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'SCHEDULE' )
            .update( schedule )
            .eq( 'id', id )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async deleteScheduleById(
        id
        )
    {
        let { error } = await supabaseService
            .getClient()
            .from( 'SCHEDULE' )
            .delete()
            .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
            return false;
        }

        return true;
    }
}

// -- VARIABLES

export let scheduleService =
    new ScheduleService(); 