// -- IMPORTS

import z, { ZodError } from 'zod';
import { cityService } from '../service/city_service';

// -- CONSTANTS

const citySchema = z.object(
    {
        provinceCode: z.string()
    }
    );

// -- TYPES

class ListCityByProvinceCodeUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = await citySchema.safeParseAsync( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let cityArray = await cityService.getCityArrayByProvinceCode( input.provinceCode );

        return cityArray;
    }
}

// -- VARIABLES

export let listCityByProvinceCodeUseCase = new ListCityByProvinceCodeUseCase();