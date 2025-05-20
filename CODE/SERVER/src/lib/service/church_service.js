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
