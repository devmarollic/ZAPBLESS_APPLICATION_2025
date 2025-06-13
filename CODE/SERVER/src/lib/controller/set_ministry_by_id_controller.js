// -- IMPORTS

import { Controller } from './controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { setMinistryByIdUseCase } from '../use_case/set_ministry_by_id_use_case';
import { ministrySchema } from '../model/ministry.js';

// -- TYPES

export class SetMinistryByIdController extends Controller
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
        let { body } = request;
        let { success, data, error } = await ministrySchema.safeParseAsync( body );

        console.log( data, error  );

        if ( !success )
        {
            throw new Error( error );
        }

        let ministry = await setMinistryByIdUseCase.execute( { ministryId, ministryData: data } );

        return ministry;
    }
} 