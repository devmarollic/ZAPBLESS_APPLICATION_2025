// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { messageWhatsappUseCase } from '../use_case/message_whatsapp_use_case';

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
}