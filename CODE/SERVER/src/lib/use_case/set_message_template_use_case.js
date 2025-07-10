// -- IMPORTS

import { z, ZodError } from 'zod';
import { messageTemplateService } from '../service/message_template_service';

// -- CONSTANTS

const partialMessageTemplateSchema = z.object(
    {
        name: z.string(),
        categoryId: z.string(),
        languageTag: z.string().default( 'pt-BR' ),
        content: z.string(),
        allowCategoryChange: z.boolean().default( false ),
        isActive: z.boolean().default( true )
    }
    ).partial();
const messageTemplateSchema = z.object({
    id: z.string()
    }).merge( partialMessageTemplateSchema );

// -- TYPES

class SetMessageTemplateUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = messageTemplateSchema.safeParse( input );

        console.log( success,error );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let { id, ...messageTemplateData } = data;
        let messageTemplate = await messageTemplateService.setMessageTemplate(
            id,
            messageTemplateData
            );

        return messageTemplate;
    }
}

// -- VARIABLES

export let setMessageTemplateUseCase = new SetMessageTemplateUseCase();