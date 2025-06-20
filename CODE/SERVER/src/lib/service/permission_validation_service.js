// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { AppError } from '../errors/app_error';
import { StatusCodes } from 'http-status-codes';
import { churchStatus } from '../model/church_status';
import { profileStatus } from '../model/profile_status';
import { subscriptionStatus, subscriptionType } from '../model/subscription';

// -- TYPES

class PermissionValidationService
{
    // -- CONSTRUCTORS

    constructor()
    {
    }

    // -- INQUIRIES

    async validateUserPermissionByEmail(
        email
        )
    {
        let { data: userPermissions, error: permissionsError } = await databaseService.getClient()
            .from( 'PROFILE' )
            .select( 
                `id,`
                + `statusId,`
                + `churchId,`
                + `CHURCH!constraint_profile_church_1 (`
                + `    id,`
                + `    statusId,`
                + `    SUBSCRIPTION (`
                + `        statusId,`
                + `        typeId`
                + `    )`
                + `),`
                + `USER_CHURCH_ROLE!inner (`
                + `    roleSlug`
                + `)`
                )
            .eq( 'email', email )
            .eq( 'statusId', profileStatus.active )
            .eq( 'CHURCH.statusId', churchStatus.active )
            .eq( 'USER_CHURCH_ROLE.roleSlug', 'administrator' )
            .eq( 'CHURCH.SUBSCRIPTION.statusId', subscriptionStatus.paid )
            .in( 'CHURCH.SUBSCRIPTION.typeId', [ subscriptionType.active, subscriptionType.trial ] )
            .single();

        console.log( userPermissions, permissionsError );
        
        if ( permissionsError !== null )
        {
            logError( permissionsError );
            
            if ( permissionsError.code === 'PGRST116' )
            {
                throw new AppError( 'USER_NOT_FOUND_OR_INSUFFICIENT_PERMISSIONS', StatusCodes.FORBIDDEN );
            }
            
            throw new AppError( 'PERMISSION_VALIDATION_ERROR', StatusCodes.INTERNAL_SERVER_ERROR );
        }

        let profile =
            {
                id: userPermissions.id,
                statusId: userPermissions.statusId,
                churchId: userPermissions.churchId
            };
            
        let subscriptionArray = userPermissions?.CHURCH?.SUBSCRIPTION ?? [];

        if ( subscriptionArray.length === 0 )
        {
            throw new AppError( 'SUBSCRIPTION_NOT_FOUND', StatusCodes.FORBIDDEN );
        }

        return (
            {
                profile,
                subscriptionArray
            }
            );
    }
}

// -- VARIABLES

export let permissionValidationService
    = new PermissionValidationService(); 