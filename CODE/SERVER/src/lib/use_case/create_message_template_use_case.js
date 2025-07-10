// -- IMPORTS

import { z, ZodError } from 'zod';
import { messageTemplateService } from '../service/message_template_service';
import { getRandomTuid } from 'senselogic-gist';

// -- CONSTANTS

const messageTemplateSchema = z.object({
    churchId: z.string(),
    name: z.string(),
    categoryId: z.string(),
    languageTag: z.string().default( 'pt-BR' ),
    content: z.string(),
    allowCategoryChange: z.boolean().default( false ),
    isActive: z.boolean().default( true )
});

// -- TYPES

class CreateMessageTemplateUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = messageTemplateSchema.safeParse( input );

        console.log( { error } );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let messageTemplate = await messageTemplateService.addMessageTemplate(
            {
                id: getRandomTuid(),
                ...data
            }
            );

        return messageTemplate;
    }
}

// -- VARIABLES

export let createMessageTemplateUseCase = new CreateMessageTemplateUseCase();