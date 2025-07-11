// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { listScheduleUseCase } from '../use_case/list_schedule_use_case';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { isNullOrUndefined } from '../../base';

// -- TYPES

export class ListScheduleController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let churchId = profileLogged?.user_metadata?.church_id;
        let scheduleArray = await listScheduleUseCase.execute(
            {
                churchId
            }
            );

        return scheduleArray;
    }
} 