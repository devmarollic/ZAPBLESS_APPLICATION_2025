// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { listMessageTemplateUseCase } from '../use_case/list_message_template_use_case';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { isNullOrUndefined } from '../../base';

// -- TYPES

export class ListMessageTemplateController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let churchId = profileLogged?.user_metadata?.church_id;
        let messageTemplateArray = await listMessageTemplateUseCase.execute(
            {
                churchId
            }
            );

        return messageTemplateArray;
    }
}