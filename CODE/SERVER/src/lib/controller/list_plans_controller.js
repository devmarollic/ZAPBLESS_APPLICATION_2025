// -- IMPORTS

import { listPlansUseCase } from '../use_case/list_plans_use_case';
import { Controller } from './controller';

// -- TYPES

export class ListPlansController extends Controller
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
