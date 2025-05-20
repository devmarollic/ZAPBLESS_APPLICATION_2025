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
}

// -- VARIABLES

export let userChurchRoleService
    = new UserChurchRoleService();
