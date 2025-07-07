// -- IMPORTS

import { getChurchAndProfileDataUseCase } from '../use_case/get_church_and_profile_data_use_case';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { Controller } from './controller';

// -- TYPES

export class GetChurchAndProfileDataController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let profileLogged = request.profileLogged;

        if ( profileLogged === null )
        {
            throw new UnauthenticatedError();
        }

        let profileId = profileLogged.id;

        let result = await getChurchAndProfileDataUseCase.execute( profileId );

        return result;
    }
} 