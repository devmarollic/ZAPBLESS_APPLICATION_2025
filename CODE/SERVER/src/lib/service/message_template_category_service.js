// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- FUNCTIONS

class MessageTemplateCategoryService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedMessageTemplateCategoryArray = null;
        this.cachedMessageTemplateCategoryArrayTimestamp = 0;
        this.cachedMessageTemplateCategoryByIdMap = null;
    }

    // -- INQUIRIES

    async getMessageTemplateCategoryArray(
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'MESSAGE_TEMPLATE_CATEGORY' )
                .select( 'id, name' );


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
        this.cachedMessageTemplateCategoryArrayTimestamp = null;
        this.cachedMessageTemplateCategoryByIdMap = null;
        this.cachedMessageTemplateCategoryArray = null;
    }

    // ~~

    async getCachedMessageTemplateCategoryArray(
        )
    {
        if ( this.cachedMessageTemplateCategoryArray === null
             || Date.now() > this.cachedMessageTemplateCategoryArrayTimestamp + 300000 )
        {
            this.cachedMessageTemplateCategoryArray = await this.getMessageTemplateCategoryArray();
            this.cachedMessageTemplateCategoryArrayTimestamp = Date.now();
            this.cachedMessageTemplateCategoryByIdMap = null;
        }

        return this.cachedMessageTemplateCategoryArray;
    }

    // ~~

    async getCachedMessageTemplateCategoryByIdMap(
        )
    {
        if ( this.cachedMessageTemplateCategoryByIdMap === null
             || Date.now() > this.cachedMessageTemplateCategoryArrayTimestamp + 300000 )
        {
            this.cachedMessageTemplateCategoryByIdMap = getMapById( await this.getCachedMessageTemplateCategoryArray() );
        }

        return this.cachedMessageTemplateCategoryByIdMap;
    }
}

// -- VARIABLES

export let messageTemplateCategoryService
    = new MessageTemplateCategoryService();
