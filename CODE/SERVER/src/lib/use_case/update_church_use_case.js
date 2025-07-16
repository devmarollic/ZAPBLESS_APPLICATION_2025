// -- IMPORTS

import { ZodError } from 'zod';
import { updateChurchSchema } from '../model/church';
import { churchService } from '../service/church_service';
import { cityService } from '../service/city_service';

// -- TYPES

class UpdateChurchUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = await updateChurchSchema.safeParseAsync( input.churchData );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let city = await cityService.getCityByCode( data.cityCode );
        let cityName = city.name;
        let stateName = city.provinceName;

        let updatedChurch = await churchService.setChurchById(
            {
                ...data,
                cityName,
                stateName
            },
            input.churchId
            );

        return updatedChurch;
    }
}

// -- VARIABLES

export let updateChurchUseCase
    = new UpdateChurchUseCase(); 