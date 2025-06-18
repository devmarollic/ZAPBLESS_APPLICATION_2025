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

    async getProfileArrayByChurchId(
        churchId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PROFILE' )
            .select(
                `
                    id,
                    legalName,
                    firstName,
                    lastName,
                    email,
                    phonePrefix,
                    phoneNumber,
                    statusId,
                    creationTimestamp,
                    roleSlugArray:USER_CHURCH_ROLE( roleSlug )
                `
            )
            .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getChurchIdByProfileId(
        profileId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PROFILE' )
            .select( 'churchId' )
            .eq( 'id', profileId )
            .single();

        if ( error !== null )
        {
            logError( error );

            return null;
        }

        return data.churchId;
    }

    // ~~

    async getChurchIdByProfileEmail(
        email
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PROFILE' )
            .select( 'churchId' )
            .eq( 'email', email )
            .single();

        if ( error !== null )
        {
            logError( error );

            return null;
        }

        return data.churchId;
    }

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

    // ~~

    async setProfileById(
        profile,
        id
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PROFILE' )
            .update( profile )
            .eq( 'id', id )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~~

    async getProfileWithChurchById(
        id
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PROFILE' )
            .select( `
                id,
                firstName,
                lastName,
                email,
                phoneNumber,
                statusId,
                churchId,
                church:CHURCH!constraint_profile_church_1 ( id, name, statusId )
            ` )
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
