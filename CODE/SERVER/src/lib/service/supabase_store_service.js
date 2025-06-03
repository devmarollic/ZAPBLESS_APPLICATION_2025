// -- IMPORTS

import { getJsonObject, getJsonText, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { whatsappService } from './whatsapp_service';

// -- TYPES

export class SupabaseStoreService
{
    // -- CONSTRUCTORS

    constructor(
        {
            churchId
        }
        )
    {
        this.churchId = churchId;
        this.sessionData = null;
    }

    // -- OPERATIONS

    async sessionExists(
        options
        )
    {
        try {
            let { data, error } = await databaseService
                .getClient()
                .from( 'WHATSAPP' )
                .select( 'session' )
                .eq( 'churchId', this.churchId )
                .single();

            if ( error !== null )
            {
                return false;
            }

            this.sessionData = data?.session;
            return data && data.session !== null;
        } catch (error) {
            logError(error);
            return false;
        }
    }

    // ~~

    async save(
        options
        )
    {
        try {
            let { session } = options;
            
            if ( !session )
            {
                return false;
            }

            const sessionData = typeof session === 'string' ? session : getJsonText(session);
            this.sessionData = sessionData;
            
            await databaseService
                .getClient()
                .from( 'WHATSAPP' )
                .update( { session: sessionData } )
                .eq( 'churchId', this.churchId );

            return true;
        } catch (error) {
            logError(error);
            return false;
        }
    }

    // ~~

    async extract(
        options
        )
    {
        try {
            if (this.sessionData) {
                return typeof this.sessionData === 'string' ? 
                    getJsonObject(this.sessionData) : 
                    this.sessionData;
            }

            let whatsapp = await whatsappService.getWhatsappByChurchId( this.churchId );

            if ( !whatsapp || !whatsapp.session )
            {
                return null;
            }

            this.sessionData = whatsapp.session;
            return typeof whatsapp.session === 'string' ? 
                getJsonObject(whatsapp.session) : 
                whatsapp.session;
        } catch (error) {
            logError(error);
            return null;
        }
    }

    // ~~

    async delete(
        options
        )
    {
        try {
            this.sessionData = null;
            await databaseService
                .getClient()
                .from( 'WHATSAPP' )
                .update( { session: null } )
                .eq( 'churchId', this.churchId );

            return true;
        } catch (error) {
            logError(error);
            return false;
        }
    }
}