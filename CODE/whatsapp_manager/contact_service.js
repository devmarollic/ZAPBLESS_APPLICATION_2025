// -- IMPORTS

import { supabaseService } from './supabase_service.js';

// -- TYPES

class ContactService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
    }

    // -- INQUIRIES

    async getContactArray(
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CONTACT' )
            .select();

        if ( error !== null )
        {
            console.error( error );
        }

        return data;
    }

    // ~~

    async getContactByChuchId(
        chuchId
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CONTACT' )
            .select()
            .eq( 'churchId', chuchId );

        if ( error !== null )
        {
            console.error( error );
        }

        return data;
    }

    // ~~

    async upsertContact(
        contact
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CONTACT' )
            .upsert( contact );

        if ( error !== null )
        {
            console.error( error );
        }

        return data;
    }
}

// -- VARIABLES

export let contactService
    = new ContactService();