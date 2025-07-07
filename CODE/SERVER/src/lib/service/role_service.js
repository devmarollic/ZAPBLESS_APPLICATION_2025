// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- FUNCTIONS

class UserChurchRoleService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
    }

    // -- INQUIRIES

    // -- OPERATIONS

    async addUserChurchRole(
        userChuchRole
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'USER_CHURCH_ROLE' )
            .insert( userChuchRole );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setUserChurchRoleByProfileIdAndChurchId(
        churchId,
        profileId,
        roleSlug
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'USER_CHURCH_ROLE' )
            .update( { roleSlug } )
            .eq( 'profileId', profileId )
            .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setOrCreateUserChurchRoleByProfileIdAndChurchId(
        churchId,
        profileId,
        roleSlug
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'USER_CHURCH_ROLE' )
            .upsert( { roleSlug, profileId, churchId } )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    async deleteUserChurchRoleByProfileIdAndChurchId(
        churchId,
        profileId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'USER_CHURCH_ROLE' )
            .delete()
            .eq( 'profileId', profileId )
            .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let userChurchRoleService
    = new UserChurchRoleService();
