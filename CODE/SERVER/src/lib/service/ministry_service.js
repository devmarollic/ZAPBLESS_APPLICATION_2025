
// -- IMPORTS

import { supabaseService } from '../service/supabase_service';

// -- TYPES

class MinistryService
{
    // -- INQUIRIES

    async getMinistryArray(
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from('MINISTRY')
            .select();

        if ( error )
        {
            throw error;
        }

        return data;
    }

    // ~~

    async getMinistryById(
        id
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from('MINISTRY')
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

    async getMinistriesByChurchId(
        churchId
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from('MINISTRY')
            .select()
            .eq('churchId', churchId );

        if ( error )
        {
            throw error;
        }

        return data;
    }

    // -- OPERATIONS

    async addMinistry(
        ministryData
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from('MINISTRY')
            .insert( ministryData )
            .select()
            .single();

        if ( error )
        {
            throw error;
        }

        return data;
    }

    // ~~

    async setMinistryById(
        ministry,
        id
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from('MINISTRY')
            .update( ministry )
            .eq('id', id )
            .select()
            .single();

        if ( error )
        {
            throw error;
        }

        return data;
    }

    // ~~

    async removeMinistryById(
        id
        )
    {
        const { error } = await supabaseService
            .getClient()
            .from('MINISTRY')
            .delete()
            .eq('id', id );

        if ( error )
        {
            throw error;
        }

        return data;
    }
}

export const ministryService = new MinistryService(); 