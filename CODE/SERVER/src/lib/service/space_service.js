// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { spaceTypeService } from './space_type_service';

// -- FUNCTIONS

class SpaceService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedSpaceArray = null;
        this.cachedSpaceArrayTimestamp = 0;
        this.cachedSpaceByIdMap = null;
    }

    // -- INQUIRIES

    inflateSpaceArray(
        spaceArray,
        spaceTypeByIdMap
        )
    {
        for ( let space of spaceArray )
        {
            space.type = spaceTypeByIdMap[ space.typeId ];
        }
    }

    // ~~

    async getSpaceArray(
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getSpaceById(
        spaceId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE' )
                .select()
                .eq( 'id', spaceId );

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

    // ~~

    async getSpaceArrayByPropertyId(
        propertyId,
        isInflated = false
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            if ( isInflated )
            {
                this.inflateSpaceArray(
                    data,
                    await spaceTypeService.getCachedSpaceTypeByIdMap()
                    );
            }
        }

        return data;
    }

    // ~~

    async getSpaceArrayByPropertyIdArray(
        propertyIdArray
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE' )
                .select()
                .in( 'propertyId', propertyIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedSpaceArray = null;
        this.cachedSpaceByIdMap = null;
    }

    // ~~

    async getCachedSpaceArray(
        )
    {
        if ( this.cachedSpaceArray === null
             || Date.now() > this.cachedSpaceArrayTimestamp + 300000 )
        {
            this.cachedSpaceArray = await this.getSpaceArray();
            this.cachedSpaceArrayTimestamp = Date.now();
            this.cachedSpaceByIdMap = null;
        }

        return this.cachedSpaceArray;
    }

    // ~~

    async getCachedSpaceByIdMap(
        )
    {
        if ( this.cachedSpaceByIdMap === null
             || Date.now() > this.cachedSpaceArrayTimestamp + 300000 )
        {
            this.cachedSpaceByIdMap = getMapById( await this.getCachedSpaceArray() );
        }

        return this.cachedSpaceByIdMap;
    }

    // ~~

    async addSpace(
        space
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE' )
                .insert( space );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setSpaceById(
        space,
        spaceId
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE' )
                .update( space )
                .eq( 'id', spaceId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeSpaceById(
        spaceId
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'SPACE' )
                .delete()
                .eq( 'id', spaceId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let spaceService
    = new SpaceService();
