// -- IMPORTS

import { cityService } from '../service/city_service';

// -- TYPES

class ListCityUseCase
{
    // -- OPERATIONS

    async execute(
        )
    {
        let cityByProvinceCodeMap = await cityService.getCachedCityByProvinceCodeMap();

        return (
            {
                cityByProvinceCodeMap
            }
            );
    }
}

// -- VARIABLES

export let listCityUseCase = new ListCityUseCase();