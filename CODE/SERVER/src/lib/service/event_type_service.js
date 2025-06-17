// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { supabaseService } from '../service/supabase_service';

// -- TYPES

class EventTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedEventTypeArray = null;
        this.cachedEventTypeArrayTimestamp = null;
        this.cachedEventTypeByIdMap = null;
    }

    // -- INQUIRIES

    async getEventTypeArray(
        )
    {
        const { data, error } = await supabaseService
            .getClient()
            .from( 'EVENT_TYPE' )
            .select(
                `id,`
                + `name`,
                + `description`
                );

        if ( error !== null )
        {
            logError( error );
        }

        return data;    
    }

    // -- OPERATIONS

    async getCachedEventTypeArray(
        )
    {
        if ( this.cachedCountryArray === null
            || Date.now() > this.cachedEventTypeArrayTimestamp + 300000 )
        {
            this.cachedEventTypeArray = await this.getEventTypeArray();
            this.cachedEventTypeArrayTimestamp = Date.now();
        }

        return this.cachedEventTypeArray;
    }

    // ~~

    async getCachedEventTypeByIdMap(
        )
    {
        if ( this.cachedEventTypeByIdMap === null
            || Date.now() > this.cachedEventTypeArrayTimestamp + 300000 )
        {
            this.cachedEventTypeByIdMap = getMapById( await this.getCachedEventTypeArray() );
        }

        return this.cachedEventTypeByIdMap;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedEventTypeArray = null;
        this.cachedEventTypeArrayTimestamp = null;
        this.cachedEventTypeByIdMap = null;
    }
}

// -- VARIABLES

export const eventTypeService =
    new EventTypeService(); 