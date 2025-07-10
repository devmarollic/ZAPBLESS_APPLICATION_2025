// -- IMPORTS

import { z, ZodError } from 'zod';
import { messageTemplateService } from '../service/message_template_service';

// -- CONSTANTS

const messageTemplateSchema = z.object({
    churchId: z.string()
});

// -- TYPES

class ListMessageTemplateUseCase
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

        let messageTemplateArray = await messageTemplateService.getMessageTemplateArrayByChurchId(
            input.churchId
            );

        return messageTemplateArray;
    }
}

// -- VARIABLES

export let listMessageTemplateUseCase = new ListMessageTemplateUseCase();