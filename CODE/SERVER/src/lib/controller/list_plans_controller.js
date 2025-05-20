// -- IMPORTS

import { listPlansUseCase } from '../use_case/list_plans_use_case';
import { PageController } from './page_controller';

// -- TYPES

export class ListPlansController extends PageController
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let planArray = await listPlansUseCase.execute();

        return planArray;
    }
}
