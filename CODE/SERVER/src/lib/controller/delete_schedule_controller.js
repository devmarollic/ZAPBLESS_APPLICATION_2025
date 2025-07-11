// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { deleteScheduleUseCase } from '../use_case/delete_schedule_use_case';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { isNullOrUndefined } from '../../base';

// -- TYPES

export class DeleteScheduleController
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
        let { id } = request.params;

        let result = await deleteScheduleUseCase.execute(
            {
                scheduleId: id,
                churchId
            }
            );

        return result;
    }
} 