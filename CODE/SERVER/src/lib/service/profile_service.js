// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- FUNCTIONS

class ProfileService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
    }

    // -- INQUIRIES

    // -- OPERATIONS

    async addProfile(
        profile
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PROFILE' )
            .insert( profile )
            .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setProfileByEmail(
        profile,
        email
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PROFILE' )
            .update( profile )
            .eq( 'email', email )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getProfileById(
        id
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PROFILE' )
            .select()
            .eq( 'id', id )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

}

// -- VARIABLES

export let profileService
    = new ProfileService();
