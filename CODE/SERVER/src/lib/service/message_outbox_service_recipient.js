// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';

// -- TYPES

class MessageOutboxServiceRecipient
{
    // -- INQUIRIES

    async getMessageOutboxRecipientById(
        id
        )
    {
        let { data, error } = supabaseService.getClient()
            .from( 'MESSAGE_OUTBOX_RECIPIENT' )
            .select()
            .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getMessageOutboxRecipientByMessageOutboxId(
        messageOutboxId
        )
    {
        let { data, error } = supabaseService.getClient()
            .from( 'MESSAGE_OUTBOX_RECIPIENT' )
            .select()
            .eq( 'messageOutboxId', messageOutboxId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addMessageOutboxRecipient(
        messageOutboxRecipient
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'MESSAGE_OUTBOX_RECIPIENT' )
            .insert( messageOutboxRecipient )
            .select();

        console.log( { data, error })

        if ( error !== null )
        {
            // logError( error );
        }

        return data;
    }

    // ~~

    async sendMessageOutboxRecipientById(
        messageOutboxRecipient,
        id
        )
    {
        let { data, error } = supabaseService.getClient()
            .from( 'MESSAGE_OUTBOX_RECIPIENT' )
            .update( messageOutboxRecipient )
            .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let messageOutboxServiceRecipient = new MessageOutboxServiceRecipient();