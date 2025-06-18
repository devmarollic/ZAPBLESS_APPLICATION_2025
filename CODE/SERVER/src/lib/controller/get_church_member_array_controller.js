// -- IMPORTS

import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { PageController } from './page_controller';
import { getChurchMemberArrayUseCase } from '../use_case/get_church_member_array_use_case';

// -- CLASS

export class GetChurchMemberArrayController extends PageController
{
    // -- INQUIRIES

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

        let churchId = profileLogged.user_metadata.church_id;
        
        let memberArray = await getChurchMemberArrayUseCase.execute( { churchId } );

        return memberArray;
    }
}
