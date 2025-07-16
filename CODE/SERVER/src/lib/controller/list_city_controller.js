// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { listCityUseCase } from '../use_case/list_city_use_case';

// -- TYPES

export class ListCityController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        let result = await listCityUseCase.execute();

        return result;
    }
}