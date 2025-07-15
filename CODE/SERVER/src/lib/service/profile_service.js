// -- IMPORTS

import { getCeilInteger, logError } from 'senselogic-gist';
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

    async getProfileArrayByChurchIdWithFilters(
        churchId,
        filters
        )
    {
        let query = databaseService.getClient()
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
                    updateTimestamp,
                    role:USER_CHURCH_ROLE!inner ( roleSlug )
                `,
                { count: 'exact' }
            )
            .eq( 'role.churchId', churchId )
            .eq( 'churchId', churchId );

        if ( filters.searchTerm )
        {
            query = query.or( `firstName.ilike.%${filters.searchTerm}%,lastName.ilike.%${filters.searchTerm}%,legalName.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%` );
        }

        if ( filters.statusFilter )
        {
            query = query.eq( 'statusId', filters.statusFilter );
        }

        if ( filters.roleFilter )
        {
            query = query.eq( 'role.roleSlug', filters.roleFilter );
        }

        let offset = ( filters.page - 1 ) * filters.limit;
        query = query.range( offset, offset + filters.limit - 1 );

        let { data, error, count } = await query;

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                data: data || [],
                totalCount: count || 0,
                totalPages: getCeilInteger( ( count || 0 ) / filters.limit ),
                currentPage: filters.page,
                hasNextPage: filters.page < getCeilInteger( ( count || 0 ) / filters.limit ),
                hasPreviousPage: filters.page > 1
            }
            );
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

    // ~~

    async getChurchAndProfileByProfileId(
        profileId
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
                legalName,
                birthDate,
                aboutDescription,
                phonePrefix,
                genderId,
                documentType,
                documentNumber,
                countryCode,
                imagePath,
                creationTimestamp,
                updateTimestamp,
                church:CHURCH!constraint_profile_church_1 ( id, name, statusId, addressLine1, addressLine2, cityCode, cityName, zipCode, neighborhood, stateCode, stateName, countryCode, coordinates, documentType, documentNumber, languageTag, imagePath, creationTimestamp, updateTimestamp )
            ` )
            .eq( 'id', profileId )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeProfileById(
        id
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PROFILE' )
            .delete()
            .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let profileService = new ProfileService();
