// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { churchSchema } from '../model/church';
import { churchService } from '../service/church_service';

// -- TYPES

class CreateChurchUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = await churchSchema.safeParse( input );

        if ( !success )
        {
            return error;
        }

        let church = await churchService.addChurch(
            {
                id: getRandomTuid(),
                statusId: 'active',
                ...data
            }
            );

        return church;
    }
}

// -- VARIABLES

export const createChurchUseCase
    = new CreateChurchUseCase();