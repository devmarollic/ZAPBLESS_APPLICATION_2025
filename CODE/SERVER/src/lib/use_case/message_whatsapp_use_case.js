// -- IMPORTS

import z, { ZodError } from 'zod';
import { contactService } from '../service/contact_service';
import { rabbitmqService } from '../service/rabbitmq_service';
import { getRandomUuid, isArray } from 'senselogic-gist';
import { messageOutboxService } from '../service/message_outbox_service';
import { messageOutboxServiceRecipient } from '../service/message_outbox_service_recipient';

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
        let messageOutboxId = getRandomUuid();
        let messageOutbox =
            {
                id: messageOutboxId,
                churchId,
                title,
                content,
                recipientType,
                sentCount: 0,
                deliveredCount: 0,
                readCount: 0,
                failedCount: 0,
                // scheduledAt: null,
                // isRecurring: false,
                // recurrenceType: null,
                // recurrenceInterval: null,
                // recurrenceDayOfWeek: null,
                // recurrenceDayOfMonth: null,
                // recurrenceTime: null,
                // recurrenceEndDate: null
            }

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

            messageOutbox.ministryId = ministryId;

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

        let messageOutboxArray = [];
        let messageOutboxRecipientArray = [];
        messageOutbox.recipientCount = recipientContactArray.length;

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

            messageOutboxArray.push(
                messageOutbox
                );

            messageOutboxRecipientArray.push(
                {
                    id: getRandomUuid(),
                    messageOutboxId,
                    contactId: contact.id,
                    number,
                    status: 'pending',
                    // sentAt: null,
                    // deliveredAt: null,
                    // readAt: null,
                    // failedAt: null,
                    // errorMessage: null
                }
                );

            await rabbitmqService.publishOutboundMessage( outboundMessage );
        }

        console.log( { messageOutboxArray, messageOutboxRecipientArray })

        await messageOutboxService.addMessageOutbox( messageOutboxArray );
        await messageOutboxServiceRecipient.addMessageOutboxRecipient( messageOutboxRecipientArray );


        return (
            {
                success: true,
                sentCount: recipientContactArray.length
            }
            );
    }
}

// -- VARIABLES

export const messageWhatsappUseCase = new MessageWhatsappUseCase();