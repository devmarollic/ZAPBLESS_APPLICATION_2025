// -- IMPORTS

import { ministryService } from '../service/ministry_service';

// -- TYPES

class SetMinistryByIdUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let ministryArray = await ministryService.setMinistryById( input.ministryData, input.ministryId );

        return ministryArray;
    }
}

export const setMinistryByIdUseCase = new SetMinistryByIdUseCase(); 