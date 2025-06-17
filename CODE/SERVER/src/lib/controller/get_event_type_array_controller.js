// -- IMPORTS

import { getEventTypeArrayUseCase } from '../use_case/get_event_type_array_use_case';

// -- TYPES

export class GetEventTypeArrayController
{
    async handle( request, response )
    {
        let eventTypeArray = await getEventTypeArrayUseCase.execute();

        return eventTypeArray;
    }
}