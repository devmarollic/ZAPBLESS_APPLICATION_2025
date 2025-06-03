// -- IMPORTS

import { supabaseService } from '../service/supabase_service';

// -- TYPES

class EventService
{
    // -- OPERATIONS

    async addEvent(
        eventData
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from('EVENT')
            .insert( eventData )
            .select()
            .single();

        if ( error )
        {
            throw error;
        }

        return data;
    }

    // ~~

    async getEventById(
        id
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from('EVENT')
            .select()
            .eq('id', id )
            .single();

        if ( error )
        {
            throw error;
        }

        return data;
    }

    // ~~

    async getEventsByChurchId(
        churchId
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from('EVENT')
            .select()
            .eq('churchId', churchId );

        if ( error )
        {
            throw error;
        }

        return data;
    }

    // ~~

    async getEventsByMinistryId(
        ministryId
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from('EVENT')
            .select()
            .eq('ministryId', ministryId );

        if ( error )
        {
            throw error;
        }

        return data;
    }
}

export const eventService = new EventService(); 