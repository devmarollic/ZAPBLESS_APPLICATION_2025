// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- FUNCTIONS

class MessageTemplateService
{
    // -- INQUIRIES

    async getMessageTemplateById(
        id
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'MESSAGE_TEMPLATE' )
            .select()
            .eq( 'id', id )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    async getMessageTemplateArrayByChurchId(
        churchId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'MESSAGE_TEMPLATE' )
                .select(
                    `id,`
                    + `name,`
                    + `content,`
                    + `allowCategoryChange,`
                    + `isActive,`
                    + `creationTimestamp,`
                    + `language:LANGUAGE (code, name),`
                    + `category:MESSAGE_TEMPLATE_CATEGORY (id, name, color)`
                    )
                .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addMessageTemplate(
        messageTemplate
    )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'MESSAGE_TEMPLATE' )
                .insert( messageTemplate );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setMessageTemplate(
        id,
        messageTemplate
    )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'MESSAGE_TEMPLATE' )
                .update( messageTemplate )
                .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeMessageTemplate(
        id
    )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'MESSAGE_TEMPLATE' )
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

export let messageTemplateService
    = new MessageTemplateService();
