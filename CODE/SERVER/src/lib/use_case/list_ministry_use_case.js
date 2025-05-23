// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { ministrySchema } from '../model/ministry';
import { ministryService } from '../service/ministry_service';

// -- TYPES

class ListMinistryUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let ministryArray = await ministryService.getMinistryArray();

        return ministryArray;
    }
}

export const listMinistryUseCase = new ListMinistryUseCase(); 