// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- FUNCTIONS

class SpaceTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedSpaceTypeArray = null;
        this.cachedSpaceTypeArrayTimestamp = 0;
        this.cachedSpaceTypeByIdMap = null;
    }

    // -- INQUIRIES

    async getSpaceTypeArray(
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getSpaceTypeById(
        spaceTypeId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE_TYPE' )
                .select()
                .eq( 'id', spaceTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedSpaceTypeArray = null;
        this.cachedSpaceTypeByIdMap = null;
    }

    // ~~

    async getCachedSpaceTypeArray(
        )
    {
        if ( this.cachedSpaceTypeArray === null
             || Date.now() > this.cachedSpaceTypeArrayTimestamp + 300000 )
        {
            this.cachedSpaceTypeArray = await this.getSpaceTypeArray();
            this.cachedSpaceTypeArrayTimestamp = Date.now();
            this.cachedSpaceTypeByIdMap = null;
        }

        return this.cachedSpaceTypeArray;
    }

    // ~~

    async getCachedSpaceTypeByIdMap(
        )
    {
        if ( this.cachedSpaceTypeByIdMap === null
             || Date.now() > this.cachedSpaceTypeArrayTimestamp + 300000 )
        {
            this.cachedSpaceTypeByIdMap = getMapById( await this.getCachedSpaceTypeArray() );
        }

        return this.cachedSpaceTypeByIdMap;
    }

    // ~~

    async addSpaceType(
        spaceType
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE_TYPE' )
                .insert( spaceType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setSpaceTypeById(
        spaceType,
        spaceTypeId
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE_TYPE' )
                .update( spaceType )
                .eq( 'id', spaceTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeSpaceTypeById(
        spaceTypeId
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE_TYPE' )
                .delete()
                .eq( 'id', spaceTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let spaceTypeService
    = new SpaceTypeService();
