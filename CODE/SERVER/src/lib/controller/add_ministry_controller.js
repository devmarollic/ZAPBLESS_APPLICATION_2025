// -- IMPORTS

import { createMinistryUseCase } from '../use_case/create_ministry_use_case';
import { Controller } from './controller';

// -- TYPES

export class AddMinistryController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { profileLogged } = request;
        let { body } = request;

        let ministry = await createMinistryUseCase.execute(
            body,
            profileLogged.id
            );

        return ministry;
    }
} 