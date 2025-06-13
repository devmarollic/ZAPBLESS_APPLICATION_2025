// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { churchSchema, churchType } from '../model/church';
import { churchService } from '../service/church_service';
import { ZodError } from 'zod';

// -- TYPES

class CreateChurchUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = await churchSchema.safeParseAsync( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let church = await churchService.addChurch(
            {
                id: getRandomTuid(),
                statusId: churchType.active,
                ...data
            }
            );

        return church;
    }
}

// -- VARIABLES

export const createChurchUseCase
    = new CreateChurchUseCase();