// -- IMPORTS

import { Controller } from '../controller/controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { createProfileUseCase } from '../use_case/create_profile_use_case';
import { documentType } from '../model/profile';
import { isNullOrUndefined } from '../../base';
import { profileGender } from '../model/profile_gender';
import { getRandomTuid } from 'senselogic-gist';

// -- TYPES

export class AddChurchUserController extends Controller
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

        let
            {
                firstName,
                lastName,
                email,
                phonePrefix,
                phoneNumber,
                role,
                status
            } = request.body;

        let churchId = profileLogged.user_metadata.church_id;

        let churchUser = await createProfileUseCase.execute(
            {
                churchId,
                statusId: status,
                firstName,
                lastName,
                genderId: profileGender.male,
                email,
                password: getRandomTuid(),
                phonePrefix,
                phoneNumber,
                countryCode: 'BR',
                documentType: documentType.cpf,
                documentNumber: null,
                aboutDescription: '',
                legalName: [ firstName, lastName ].filter( Boolean ).join( ' ' ),
                roleSlug: role
            }
            );

        return churchUser;
    }
}