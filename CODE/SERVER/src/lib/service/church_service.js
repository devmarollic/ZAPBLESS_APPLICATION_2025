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
}

// -- VARIABLES

export let churchService
    = new ChurchService();
