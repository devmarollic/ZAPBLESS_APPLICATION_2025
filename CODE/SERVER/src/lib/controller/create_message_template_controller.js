// -- IMPORTS

import { createMessageTemplateUseCase } from '../use_case/create_message_template_use_case';
import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- TYPES

export class CreateMessageTemplateController
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

        let churchId = profileLogged?.user_metadata?.church_id;
        let { body } = request;

        let messageTemplate = await createMessageTemplateUseCase.execute(
            {
                ...body,
                churchId
            }
            );

        return messageTemplate;
    }
}