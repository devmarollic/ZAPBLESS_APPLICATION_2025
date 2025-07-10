// -- IMPORTS

import { z, ZodError } from 'zod';
import { messageTemplateService } from '../service/message_template_service';

// -- CONSTANTS

const messageTemplateSchema = z.object(
    {
        id: z.string()
    }
    );

// -- TYPES

class RemoveMessageTemplateUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = messageTemplateSchema.safeParse( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let messageTemplate = await messageTemplateService.removeMessageTemplate(
            data.id
            );

        return messageTemplate;
    }
}

// -- VARIABLES

export let removeMessageTemplateUseCase = new RemoveMessageTemplateUseCase();