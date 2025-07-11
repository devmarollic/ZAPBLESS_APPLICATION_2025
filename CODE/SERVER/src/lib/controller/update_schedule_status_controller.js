// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { updateScheduleStatusUseCase } from '../use_case/update_schedule_status_use_case';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { isNullOrUndefined } from '../../base';

// -- TYPES

export class UpdateScheduleStatusController
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
        let { statusId, errorMessage } = request.body;

        let result = await updateScheduleStatusUseCase.execute(
            {
                scheduleId: id,
                statusId,
                churchId,
                errorMessage
            }
            );

        return result;
    }
} 