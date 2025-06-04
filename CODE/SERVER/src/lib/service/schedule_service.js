// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
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
}

// -- VARIABLES

export let scheduleService =
    new ScheduleService(); 