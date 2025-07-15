// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { messageWhatsappUseCase } from '../use_case/message_whatsapp_use_case';
import { databaseService } from '../service/database_service';
import { messageOutboxService } from '../service/message_outbox_service';
import { messageOutboxServiceRecipient } from '../service/message_outbox_service_recipient';

// -- TYPES

export class MessageWhatsappController
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let body = request.body;
        let churchId = profileLogged?.user_metadata?.church_id;

        let result = await messageWhatsappUseCase.execute(
            {
                ...body,
                churchId
            }
            );

        return reply.status( StatusCodes.OK  ).send( result );
    }

    async stats(
        request,
        reply
        )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let churchId = profileLogged?.user_metadata?.church_id;

        let messageOutboxArray = await messageOutboxService.getMessageOutboxByChurchId( churchId, true );

        let messageCount = messageOutboxArray.length;
        let recipientCount = 0;
        let sentCount = 0;
        let deliveredCount = 0;
        let readCount = 0;
        let failedCount = 0;
        let messageArray = [];

        for ( let message of messageOutboxArray )
        {
            let recipientList = message.messageBoxRecipientArray || [];
            let sent = recipientList.filter(r => r.status === 'sent' || r.status === 'delivered' || r.status === 'read').length;
            let delivered = recipientList.filter(r => r.status === 'delivered' || r.status === 'read').length;
            let read = recipientList.filter(r => r.status === 'read').length;
            let failed = recipientList.filter(r => r.status === 'failed').length;
            let successRate = recipientList.length > 0 ? (delivered / recipientList.length) * 100 : 0;

            recipientCount += recipientList.length;
            sentCount += sent;
            deliveredCount += delivered;
            readCount += read;
            failedCount += failed;

            messageArray.push(
                {
                    id: message.id,
                    title: message.title,
                    content: message.content,
                    recipientCount: recipientList.length,
                    status: message.status,
                    sentCount: sent,
                    deliveredCount: delivered,
                    readCount: read,
                    failedCount: failed,
                    dateTime: message.creationTimestamp || message.created_at || message.createdAt,
                    successRate,
                    targetType: message.recipientType,
                    sentAt: message.sentAt
                }
                );
        }

        let sendRate = recipientCount > 0 ? ( sentCount / recipientCount ) * 100 : 0;
        let deliveryRate = recipientCount > 0 ? ( deliveredCount / recipientCount ) * 100 : 0;

        return reply.status( StatusCodes.OK ).send(
            {
                messageCount,
                recipientCount,
                sendRate,
                deliveryRate,
                messageArray
            }
            );
    }
}