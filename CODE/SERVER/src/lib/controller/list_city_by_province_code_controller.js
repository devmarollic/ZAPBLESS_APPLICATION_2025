// -- IMPORTS

import { listCityByProvinceCodeUseCase } from '../use_case/list_city_by_province_code_use_case';

// -- TYPES

export class ListCityByProvinceCodeController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        let cityArray = await listCityByProvinceCodeUseCase.execute( request.params );

        return cityArray;
    }
}