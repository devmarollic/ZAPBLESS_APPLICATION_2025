// -- IMPORTS

import { createProfileUseCase } from '../use_case/create_profile_use_case';
import { PageController } from './page_controller';

// -- TYPES

export class ProfileController extends PageController
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
