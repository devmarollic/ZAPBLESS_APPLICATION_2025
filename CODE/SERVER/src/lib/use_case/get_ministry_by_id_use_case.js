// -- IMPORTS

import { ministryService } from '../service/ministry_service';

// -- TYPES

class GetMinistryByIdUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let ministryArray = await ministryService.getMinistryById( input.ministryId );

        return ministryArray;
    }
}

export const getMinistryByIdUseCase = new GetMinistryByIdUseCase(); 