// -- IMPORTS

import { planService } from '../service/plan_service';

//  TYPES

class ListPlansUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let planArray = await planService.getCachedPlanArray();

        return planArray;
    }
}

// -- VARIABLES

export const listPlansUseCase
    = new ListPlansUseCase();