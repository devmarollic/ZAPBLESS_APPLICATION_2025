// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

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
                .eq( 'id', whatsappId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getWhatsappByChurchId(
        churchId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'WHATSAPP' )
                .select()
                .eq( 'churchId', churchId )
                .single();

        if ( error !== null )
        {
            if ( error.code === 'PGRST116' )
            {
                return null;
            }
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
        let { error } =
            await databaseService.getClient()
                .from( 'WHATSAPP' )
                .delete()
                .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }
    }
}

// -- VARIABLES

export let whatsappService
    = new WhatsappService();
