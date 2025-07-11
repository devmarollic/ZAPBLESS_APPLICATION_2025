// -- IMPORTS

import { getMinistriesByChurchUseCase } from '../use_case/get_ministries_by_church_use_case';
import { Controller } from './controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- TYPES

export class GetMinistriesByChurchController extends Controller
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

        let churchId = request.profileLogged.user_metadata.church_id;
        let { roleSlug = null } = request.query;

        let ministries = await getMinistriesByChurchUseCase.execute(
            churchId,
            roleSlug
            );

        return ministries;
    }
} 