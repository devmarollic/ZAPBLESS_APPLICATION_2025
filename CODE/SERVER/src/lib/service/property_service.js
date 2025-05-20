// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { spaceService } from './space_service';

// -- FUNCTIONS

class PropertyService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPropertyArray = null;
        this.cachedPropertyArrayTimestamp = 0;
        this.cachedPropertyByIdMap = null;
    }

    // -- INQUIRIES

    inflateProperty(
        property,
        propertySpaceArray
        )
    {
        property.spaceArray = propertySpaceArray;
        property.spaceByIdMap = getMapById( propertySpaceArray );
    }

    // ~~

    inflatePropertyArray(
        propertyArray,
        spaceArray
        )
    {
        let propertyByIdMap = {};

        for ( let property of propertyArray )
        {
            property.spaceArray = [];
            property.spaceByIdMap = {};
            propertyByIdMap[ property.id ] = property;
        }

        for ( let space of spaceArray )
        {
            let property = propertyByIdMap[ space.propertyId ];
            property.spaceArray.push( space );
            property.spaceByIdMap[ space.id ] = space;
        }
    }

    // ~~

    async getPropertyArray(
        isInflated = false
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'PROPERTY' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            if ( isInflated )
            {
                this.inflatePropertyArray(
                    data,
                    await spaceService.getSpaceArray()
                    );
            }
        }

        return data;
    }

    // ~~

    async getFavoritePropertyArray(
        isInflated = false
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'PROPERTY' )
                .select()
                .eq( 'isFavorite', true );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            if ( isInflated )
            {
                this.inflatePropertyArray(
                    data,
                    await spaceService.getSpaceArray()
                    );
            }
        }

        return data;
    }

    // ~~

    async getPropertyById(
        propertyId,
        isInflated = false
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'PROPERTY' )
                .select()
                .eq( 'id', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            if ( isInflated )
            {
                this.inflateProperty(
                    data[ 0 ],
                    await spaceService.getSpaceArrayByPropertyId( data[ 0 ].id, true )
                    );
            }

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
        this.cachedPropertyArray = null;
        this.cachedPropertyByIdMap = null;
    }

    // ~~

    async getCachedPropertyArray(
        )
    {
        if ( this.cachedPropertyArray === null
             || Date.now() > this.cachedPropertyArrayTimestamp + 300000 )
        {
            this.cachedPropertyArray = await this.getPropertyArray();
            this.cachedPropertyArrayTimestamp = Date.now();
            this.cachedPropertyByIdMap = null;
        }

        return this.cachedPropertyArray;
    }

    // ~~

    async getCachedPropertyByIdMap(
        )
    {
        if ( this.cachedPropertyByIdMap === null
             || Date.now() > this.cachedPropertyArrayTimestamp + 300000 )
        {
            this.cachedPropertyByIdMap = getMapById( await this.getCachedPropertyArray() );
        }

        return this.cachedPropertyByIdMap;
    }

    // ~~

    async addProperty(
        property
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'PROPERTY' )
                .insert( property );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setPropertyById(
        property,
        propertyId
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'PROPERTY' )
                .update( property )
                .eq( 'id', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removePropertyById(
        propertyId
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'PROPERTY' )
                .delete()
                .eq( 'id', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let propertyService
    = new PropertyService();
