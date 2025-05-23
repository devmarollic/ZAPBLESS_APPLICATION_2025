// -- IMPORTS

import { listMinistryUseCase } from '../use_case/list_ministry_use_case';
import { Controller } from './controller';

// -- TYPES

export class ListMinistryController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let ministryArray = await listMinistryUseCase.execute();

        return ministryArray;
    }
} 