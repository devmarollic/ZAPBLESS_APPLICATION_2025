// -- IMPORTS

import { createEventUseCase } from '../use_case/create_event_use_case';
import { Controller } from './controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- TYPES

export class EventController extends Controller
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

        let { body } = request;

        let event = await createEventUseCase.execute(
            body,
            request.profileLogged.id
            );

        return event;
    }
} 