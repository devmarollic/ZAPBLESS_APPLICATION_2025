// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class WhatsappSessionService
{
    // -- INQUIRIES

    async getWhatsappSessionById(
        id
        )
    {
        let { data, error } = await databaseService
            .getClient()
            .from( 'WHATSAPP_SESSION' )
            .select( 'sessionData' )
            .eq( 'id', id )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getWhatsappSessionByChurchId(
        churchId
        )
    {
        let { data, error } = await databaseService
            .getClient()
            .from( 'WHATSAPP_SESSION' )
            .select( 'sessionData' )
            .eq( 'churchId', churchId )
            .single();

        if ( error !== null )
        {
            return null;
        }

        return data;
    }

    // ~~

    async getWhatsappSessionByClientId(
        clientId
        )
    {
        let { data, error } = await databaseService
            .getClient()
            .from( 'WHATSAPP_SESSION' )
            .select( 'sessionData' )
            .eq( 'clientId', clientId )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addSession(
        session
        )
    {
        let { data, error } = await databaseService
            .getClient()
            .from( 'WHATSAPP_SESSION' )
            .insert( session )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export const whatsappSessionService =
    new WhatsappSessionService();