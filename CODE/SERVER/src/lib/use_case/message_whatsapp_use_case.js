// -- IMPORTS

import z, { ZodError } from 'zod';
import { contactService } from '../service/contact_service';
import { rabbitmqService } from '../service/rabbitmq_service';
import { isArray } from 'senselogic-gist';

// -- CONSTANTS

const messageWhatsappSchema = z.object(
    {
        title: z.string(),
        content: z.string(),
        recipientType: z.enum( [ 'all', 'ministry', 'specific' ] ),
        ministryId: z.string().optional(),
        memberIdArray: z.array( z.string() ).optional(),
        churchId: z.string()
    }
    );

// -- TYPES

class MessageWhatsappUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { data, success, error } = messageWhatsappSchema.safeParse( input );

        if ( !success )
        {
            throw new ZodError( error.message );
        }

        let { title, content, recipientType, ministryId, memberIdArray, churchId } = data;
        let recipientContactArray = [];

        if ( recipientType === 'all' )
        {
            if ( !churchId )
            {
                throw new Error( 'churchId is required for recipientType "all"' );
            }

            recipientContactArray = await contactService.getContactArrayByChurchId( churchId );
        }
        else if ( recipientType === 'ministry' )
        {
            if ( !ministryId )
            {
                throw new Error( 'ministryId is required for recipientType "ministry"' );
            }

            recipientContactArray = await contactService.getContactArrayByMinistryIdAndChurchId( ministryId, churchId );
        }
        else if ( recipientType === 'specific' )
        {
            if ( !isArray( memberIdArray ) || memberIdArray.length === 0 )
            {
                throw new Error( 'memberIdArray is required for recipientType "specific"' );
            }

            recipientContactArray = await contactService.getContactArrayByIdArray( memberIdArray );
        }
        else
        {
            throw new Error( 'Invalid recipientType' );
        }

        for ( let contact of recipientContactArray )
        {
            if ( !contact.number )
            {
                continue;
            }

            let number = contact.number;
            let message = `${ title }\n\n${ content }`;
            let outboundMessage =
                {
                    to: number,
                    type: 'text',
                    text: message,
                    churchId
                };

            await rabbitmqService.publishOutboundMessage( outboundMessage );
        }

        return { success: true, sentCount: recipientContactArray.length };
    }
}

// -- VARIABLES

export const messageWhatsappUseCase = new MessageWhatsappUseCase();