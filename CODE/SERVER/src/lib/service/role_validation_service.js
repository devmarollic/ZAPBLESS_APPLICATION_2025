// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { AppError } from '../errors/app_error';
import { StatusCodes } from 'http-status-codes';

// -- TYPES

class RoleValidationService
{
    // -- CONSTRUCTORS

    constructor()
    {
    }

    // -- INQUIRIES

    async validateUserIsAdministrator(
        profileId,
        churchId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'USER_CHURCH_ROLE' )
            .select( 'roleSlug' )
            .eq( 'profileId', profileId )
            .eq( 'churchId', churchId )
            .eq( 'roleSlug', 'administrator' )
            .single();

        if ( error !== null )
        {
            logError( error );
            
            if ( error.code === 'PGRST116' )
            {
                throw new AppError( 'INSUFFICIENT_PERMISSIONS', StatusCodes.FORBIDDEN );
            }
            
            throw new AppError( 'PERMISSION_VALIDATION_ERROR', StatusCodes.INTERNAL_SERVER_ERROR );
        }

        return data;
    }
}

// -- VARIABLES

export let roleValidationService
    = new RoleValidationService(); 