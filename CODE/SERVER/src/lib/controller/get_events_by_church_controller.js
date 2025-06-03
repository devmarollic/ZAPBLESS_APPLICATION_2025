// -- IMPORTS

import { getEventsByChurchUseCase } from '../use_case/get_events_by_church_use_case';
import { Controller } from './controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- TYPES

export class GetEventsByChurchController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        if ( request.profileLogged === null )
        {
            throw new UnauthenticatedError();
        }

        let events = await getEventsByChurchUseCase.execute(
            request.profileLogged.id
            );

        return events;
    }
} 