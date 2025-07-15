// -- IMPORTS

import { supabaseService } from './supabase_service';

// -- TYPES

class ContactService
{
    // -- INQUIRES

    async getContactArrayByChurchId(
        churchId
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CONTACT' )
            .select()
            .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getContactById(
        id
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CONTACT' )
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

    async getContactArrayByIdArray(
        idArray
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CONTACT' )
            .select()
            .in( 'id', idArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~~

    async getContactArrayByMinistryIdAndChurchId(
        ministryId,
        churchId
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CONTACT' )
            .select(
                `*,`
                + `contact:CONTACT_MINISTRY!inner (
                    ministryId,
                )`
            )
            .eq( 'churchId', churchId )
            .eq( 'contact.ministryId', ministryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export const contactService = new ContactService();