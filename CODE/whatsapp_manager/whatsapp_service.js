// -- IMPORTS

import { supabaseService } from './supabase_service.js';
import { getMap } from './utils.js';

// -- TYPES

class WhatsappService
{
    // -- INQUIRIES

    async getWhatsapp(
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'WHATSAPP' )
            .select()
            .eq( 'churchId', process.env.CHURCH_ID )
            .single();

        if ( error !== null )
        {
            return null;
        }

        return data;
    }

    // -- OPERATIONS

    async addWhatsapp(
        whatsapp
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'WHATSAPP' )
            .insert( whatsapp )
            .select()
            .single();

        if ( error !== null )
        {
            return null;
        }

        return data;
    }

    // ~~~

    async setWhatsapp(
        whatsapp,
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'WHATSAPP' )
            .update( whatsapp )
            .eq( 'churchId', process.env.CHURCH_ID )
            .select()
            .single();

        if ( error !== null )
        {
            return null;
        }

        return data;
    }

    // ~~~

    async upsertWhatsapp(
        whatsapp
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'WHATSAPP' )
            .upsert( whatsapp )
            .eq( 'churchId', process.env.CHURCH_ID )
            .select()
            .single();

        if ( error !== null )
        {
            return null;
        }

        return data;
    }
}

// -- VARIABLES

export let whatsappService
    = new WhatsappService();