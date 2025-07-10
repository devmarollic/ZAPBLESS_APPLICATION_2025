// -- IMPORTS

import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { removeMessageTemplateUseCase } from '../use_case/remove_message_template_use_case';

// -- TYPES

export class RemoveMessageTemplateController
{
    async handle( request, response )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let { id } = request.params;

        let messageTemplate = await removeMessageTemplateUseCase.execute( { id } );

        return response.status( 200 ).send( messageTemplate );
    }
}