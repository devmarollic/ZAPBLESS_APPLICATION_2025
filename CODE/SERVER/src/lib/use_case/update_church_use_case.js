// -- IMPORTS

import { ZodError } from 'zod';
import { updateChurchSchema } from '../model/church';
import { churchService } from '../service/church_service';

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

        let updatedChurch = await churchService.setChurchById(
            data,
            input.churchId
            );

        return updatedChurch;
    }
}

// -- VARIABLES

export let updateChurchUseCase
    = new UpdateChurchUseCase(); 