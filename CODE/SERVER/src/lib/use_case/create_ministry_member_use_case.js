// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { AppError } from '../errors/app_error';
import { ministryMemberSchema } from '../model/ministry_member';
import { ministryMemberService } from '../service/ministry_member_service';
import { ZodError } from 'zod';

// -- TYPES

class CreateMinistryMemberUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        console.log( input );
        let { success, error, data } = await ministryMemberSchema.safeParseAsync( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let ministryMember = await ministryMemberService.addMinistryMember(
            {
                id: getRandomTuid(),
                ...data
            }
            );

        return ministryMember;
    }
}

// -- VARIABLES

export let createMinistryMemberUseCase =
    new CreateMinistryMemberUseCase(); 