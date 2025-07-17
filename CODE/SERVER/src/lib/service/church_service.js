// -- IMPORTS

import { log, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- FUNCTIONS

class ChurchService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
    }

    // -- INQUIRIES

    async getChurchById(
        churchId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'CHURCH' )
            .select()
            .eq( 'id', churchId )
            .single();
        
        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addChurch(
        church
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'CHURCH' )
            .insert( church )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setChurchById(
        church,
        churchId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'CHURCH' )
            .update( church )
            .eq( 'id', churchId )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeChurchById(
        churchId
        )
    {
        let { error } = await databaseService.getClient()
            .from( 'CHURCH' )
            .delete()
            .eq( 'id', churchId );

        if ( error !== null )
        {
            logError( error );
        }
    }
}

// -- VARIABLES

export let churchService
    = new ChurchService();
