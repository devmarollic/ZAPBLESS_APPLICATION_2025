// -- IMPORTS

import { createProfileUseCase } from '../use_case/create_profile_use_case';
import { Controller } from './controller';

// -- TYPES

export class ProfileController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { body } = request;

        let profile = await createProfileUseCase.execute(
            body
            );

        return profile;
    }
}
