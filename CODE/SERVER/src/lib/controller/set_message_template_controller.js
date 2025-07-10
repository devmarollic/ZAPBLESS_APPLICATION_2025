// -- IMPORTS

import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { setMessageTemplateUseCase } from '../use_case/set_message_template_use_case';

// -- TYPES

export class SetMessageTemplateController
{
    async handle( request, response )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let body = request.body;
        let { id } = request.params;

        let messageTemplate = await setMessageTemplateUseCase.execute( { id, ...body } );

        return response.status( 200 ).send( messageTemplate );
    }
}