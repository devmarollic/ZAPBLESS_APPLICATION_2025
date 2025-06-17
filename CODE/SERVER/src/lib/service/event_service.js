// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from '../service/supabase_service';

// -- TYPES

class EventService
{
     // -- INQUIRIES

     async getEventById(
        id
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from( 'EVENT' )
            .select()
            .eq( 'id', id  )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getEventArrayByChurchId(
        churchId
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from( 'EVENT' )
            .select( `
                id,
                ministryId,
                title,
                description,
                location,
                statusId,
                typeId,
                startAtTimestamp,
                endAtTimestamp,
                ministry:MINISTRY!inner ( id, name, color ),
                status:EVENT_STATUS!inner ( id, name ),
                type:EVENT_TYPE!inner ( id, name )
            ` )
            .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getEventArrayByMinistryId(
        ministryId
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from( 'EVENT' )
            .select()
            .eq( 'ministryId', ministryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addEvent(
        eventData
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from( 'EVENT' )
            .insert( eventData )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeEventById(
        id
        )
    {
        let { error } = await supabaseService
            .getClient()
            .from( 'EVENT' )
            .delete()
            .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }
    }
}

export const eventService =
    new EventService(); 