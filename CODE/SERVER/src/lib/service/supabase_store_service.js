// -- IMPORTS

import { getJsonObject, getJsonText, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { whatsappService } from './whatsapp_service';
import fs from 'node:fs';

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
        if ( !churchId )
        {
            throw new Error( 'churchId is required' );
        }

        this.churchId = churchId;
        this.sessionData = null;
    }

    // -- OPERATIONS

    async sessionExists(
        { session }
        )
    {
        let { data, error } = await databaseService
            .getClient()
            .from( 'WHATSAPP' )
            .select( 'id, sessionData' )
            .eq( 'clientId', session )
            .single();

        if ( error !== null || !data )
        {
            return false;
        }

        // só consideramos que a sessão existe se há dados válidos
        return !!( data.sessionData && data.sessionData.base64 );
    }

    // ~~

    async save(
        { session }
        )
    {
        let zipBuffer = fs.readFileSync( session + '.zip' );
        let base64Zip  = zipBuffer.toString( 'base64' );

        let { data: sessionAlreadyExists } = await databaseService
            .getClient()
            .from( 'WHATSAPP' )
            .select( 'id' )
            .eq( 'clientId', session )
            .single();

        if ( sessionAlreadyExists )
        {
            await databaseService
                .getClient()
                .from( 'WHATSAPP' )
                .update( { sessionData: { base64: base64Zip } } )
                .eq( 'clientId', session );
        }
        else
        {
            await databaseService
                .getClient()
                .from( 'WHATSAPP' )
                .insert(
                    {
                        churchId: this.churchId,
                        clientId: session,
                        sessionData: { base64: base64Zip }
                    }
                    );
        }
    }

    // ~~

    async extract(
        options
        )
    {
        let { session, path } = options;

        let { data, error } = await databaseService
            .getClient()
            .from( 'WHATSAPP' )
            .select( 'sessionData' )
            .eq( 'clientId', session )
            .single();
        
        if ( error !== null || !data || !data.sessionData || !data.sessionData.base64 )
        {
            // não há sessão armazenada ainda
            return null;
        }

        const base64Zip = data.sessionData.base64;
        const zipBuffer = Buffer.from( base64Zip, 'base64' );

        fs.writeFileSync( path, zipBuffer );
    }

    // ~~

    async delete(
        { session }
        )
    {
        let { error } = await databaseService
            .getClient()
            .from( 'WHATSAPP' )
            .delete()
            .eq( 'clientId', session );

        if ( error !== null )
        {
            logError( error );

            return false;
        }

        return true;
    }
}