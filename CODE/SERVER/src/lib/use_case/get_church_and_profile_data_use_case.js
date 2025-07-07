// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from '../service/database_service';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { NotFoundError } from '../errors/not_found';
import { profileService } from '../service/profile_service';

// -- TYPES

class GetChurchAndProfileDataUseCase
{
    // -- CONSTRUCTORS

    constructor()
    {
    }

    // -- OPERATIONS

    async execute(
        profileId
        )
    {
        if ( !profileId )
        {
            throw new UnauthenticatedError();
        }

        let profileData = await profileService.getChurchAndProfileByProfileId( profileId );

        if ( !profileData )
        {
            throw new NotFoundError( 'Profile not found' );
        }

        let churchData = profileData.role?.church;

        if ( !churchData )
        {
            throw new NotFoundError( 'Church not found for this profile' );
        }

        return (
            {
                church:
                    {
                        id: churchData.id,
                        name: churchData.name,
                        imagePath: churchData.imagePath,
                        addressLine1: churchData.addressLine1,
                        addressLine2: churchData.addressLine2,
                        cityName: churchData.cityName,
                        cityCode: churchData.cityCode,
                        stateCode: churchData.stateCode,
                        stateName: churchData.stateName,
                        countryCode: churchData.countryCode,
                        neighborhood: churchData.neighborhood,
                        zipCode: churchData.zipCode,
                        languageTag: churchData.languageTag
                    },
                user:
                    {
                        id: profileData.id,
                        firstName: profileData.firstName,
                        lastName: profileData.lastName,
                        phonePrefix: profileData.phonePrefix,
                        phoneNumber: profileData.phoneNumber,
                        documentType: profileData.documentType,
                        documentNumber: profileData.documentNumber,
                        genderId: profileData.genderId,
                        imagePath: profileData.imagePath
                    }
            }
            );
    }
}

// -- VARIABLES

export let getChurchAndProfileDataUseCase = new GetChurchAndProfileDataUseCase(); 