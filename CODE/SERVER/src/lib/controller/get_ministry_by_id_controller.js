// -- IMPORTS

import { Controller } from './controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { getMinistryByIdUseCase } from '../use_case/get_ministry_by_id_use_case.js';

// -- TYPES

export class GetMinistryByIdController extends Controller
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

        let { ministryId } = request.params;

        let ministry = await getMinistryByIdUseCase.execute( { ministryId } );

        return ministry;
    }
} 