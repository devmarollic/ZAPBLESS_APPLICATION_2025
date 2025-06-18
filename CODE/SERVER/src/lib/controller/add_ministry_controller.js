// -- IMPORTS

import { createMinistryUseCase } from '../use_case/create_ministry_use_case';
import { createMinistryMemberUseCase } from '../use_case/create_ministry_member_use_case';
import { Controller } from './controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { ministryMemberRoleSlug } from '../model/ministry_member';

// -- TYPES

export class AddMinistryController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        if ( request.profileLogged === null )
        {
            throw new UnauthenticatedError();
        }

        let { body } = request;

        let ministry = await createMinistryUseCase.execute(
            body,
            request.profileLogged.id
            );

        await createMinistryMemberUseCase.execute(
            {
                ministryId: ministry.id,
                profileId: body.leaderId,
                roleSlug: ministryMemberRoleSlug.leader
            }
            );

        return ministry;
    }
} 