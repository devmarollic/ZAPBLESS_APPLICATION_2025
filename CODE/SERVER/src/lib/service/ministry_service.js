// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from '../service/supabase_service';
import { ministryMemberRoleSlug } from '../model/ministry_member';

// -- TYPES

class MinistryService
{
    // -- INQUIRIES

    async getMinistryArray(
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from( 'MINISTRY' )
            .select(
                `id,`
                + `churchId,`
                + `name,`
                + `description,`
                + `color`
            );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getMinistryArrayByChurchId(
        churchId
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from( 'MINISTRY' )
            .select()
            .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
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
            .from( 'MINISTRY' )
            .select(
                `id,`
                + `name, `
                + `description, `
                + `color,`
                + `leaderArray:MINISTRY_MEMBER!inner(
                    profile:PROFILE (
                        id,
                        legalName
                    )
                )`
                )
            .eq( 'id', id )
            .single();

        if ( error !== null )
        {
            logError( error );
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
            .from( 'MINISTRY' )
            .select(
                `id,`
                + `name, `
                + `description, `
                + `color,`
                + `leaderArray:MINISTRY_MEMBER!inner(
                    profile:PROFILE (
                        id,
                        legalName
                    )
                ),`
                + `memberCountArray:MINISTRY_MEMBER(count)`
            )
            .eq( 'churchId', churchId )
            .eq( 'leaderArray.roleSlug', ministryMemberRoleSlug.leader );

        if ( error !== null )
        {
            logError( error );
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
            .from( 'MINISTRY' )
            .insert( ministryData )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
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
            .from( 'MINISTRY' )
            .update( ministry )
            .eq('id', id )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
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
            .from( 'MINISTRY' )
            .delete()
            .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

export const ministryService = new MinistryService(); 