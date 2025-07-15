// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';

// -- TYPES

class MessageOutboxService
{
    // -- INQUIRIES

    async getMessageOutboxByChurchId(
        churchId,
        isInflated = false
        )
    {
        let query = await supabaseService.getClient()
            .from( 'MESSAGE_OUTBOX' );
            

        if ( isInflated )
        {
            query = query.select(
                `*,
                messageBoxRecipientArray:MESSAGE_OUTBOX_RECIPIENT(
                    id,
                    messageOutboxId,
                    status
                )`
            );
        }
        else
        {
            query = query.select();
        }

        let { data, error } = await query.eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addMessageOutbox(
        messageOutbox
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'MESSAGE_OUTBOX' )
            .insert( messageOutbox )
            .select();

            console.log( { data, error })

        if ( error !== null )
        {
            // logError( error );
        }

        return data;
    }

    // ~~

    async sendMessageOutboxById(
        messageBox,
        id
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'MESSAGE_OUTBOX' )
            .update( messageBox )
            .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let messageOutboxService = new MessageOutboxService();