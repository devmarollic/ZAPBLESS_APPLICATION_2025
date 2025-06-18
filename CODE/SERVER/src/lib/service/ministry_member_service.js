
// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from '../service/supabase_service';

// -- TYPES

class MinistryMemberService
{
    // -- INQUIRIES

    async getMinistryMemberArray(
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'MINISTRY_MEMBER' )
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

    // -- OPERATIONS

    async addMinistryMember(
        ministryMemberData
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'MINISTRY_MEMBER' )
            .insert( ministryMemberData )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

export const ministryMemberService =
    new MinistryMemberService(); 