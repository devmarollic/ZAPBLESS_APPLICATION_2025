// -- IMPORTS

import { eventTypeService } from '../service/event_type_service';

// -- TYPES

class GetEventTypeArrayUseCase
{
    // -- OPERATIONS

    async execute(
        )
    {
        let eventTypeArray = await eventTypeService.getCachedEventTypeArray();

        return eventTypeArray;
    }
}

// -- VARIABLES

export let getEventTypeArrayUseCase = new GetEventTypeArrayUseCase(); 