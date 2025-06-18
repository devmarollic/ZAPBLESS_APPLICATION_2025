// -- IMPORTS

import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { getActivePlanDetailsUseCase } from '../use_case/get_active_plan_details_use_case';
import { Controller } from './controller';

// -- TYPES

export class GetActivePlanDetailsController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let churchId = profileLogged.user_metadata.church_id;

        console.log( 'churchId', churchId );
        
        let planDetails = await getActivePlanDetailsUseCase.execute( { churchId } );

        return planDetails;
    }
} 