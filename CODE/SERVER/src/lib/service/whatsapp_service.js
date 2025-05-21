// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- FUNCTIONS

class WhatsappService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedWhatsappArrayTimestamp = 0;
        this.cachedWhatsappByIdMap = null;
    }

    // -- INQUIRIES

    async getWhatsappById(
        whatsappId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'WHATSAPP' )
                .select()
                .eq( 'id', whatsappId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCachedWhatsappById(
        whatsappId
        )
    {
        if ( this.cachedWhatsappByIdMap === null
             || Date.now() > this.cachedWhatsappArrayTimestamp + 300000 )
        {
            let whatsappArray = await this.getWhatsappArray();
            this.cachedWhatsappArrayTimestamp = Date.now();
            this.cachedWhatsappByIdMap = getMapById( whatsappArray );
        }

        return this.cachedWhatsappByIdMap;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedSpaceTypeByIdMap = null;
        this.cachedSpaceTypeArrayTimestamp = 0;
    }

    // ~~

    async addWhatsapp(
        whatsapp
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'WHATSAPP' )
                .insert( whatsapp )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setWhatsappById(
        whatsapp,
        id
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'WHATSAPP' )
                .update( whatsapp )
                .eq( 'id', id )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeWhatsappById(
        id
        )
    {
        this.clearCache();

        let { data, error } =
            await databaseService.getClient()
                .from( 'WHATSAPP' )
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

export let whatsappService
    = new WhatsappService();
