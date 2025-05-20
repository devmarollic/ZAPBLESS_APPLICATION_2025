// -- IMPORTS

import Church from '../entities/church';

// -- TYPES

class ChurchService
{
    // -- OPERATIONS

    createChurch(
        {
            id,
            name,
            statusId = null,
            addressLine1 = null,
            addressLine2 = null,
            cityCode = null,
            cityName = null,
            countryCode = null,
            languageTag = null,
            imagePath = null
        }
        )
    {
        if ( !id || !name )
        {
            throw new Error('Church must have at least an id and a name');
        }

        return new Church(
            {
                id,
                name,
                statusId,
                addressLine1,
                addressLine2,
                cityCode,
                cityName,
                countryCode,
                languageTag,
                imagePath,
            }
            );
    }

    // ~~

    canBeActivated(
        church
        )
    {
        return Boolean( church.cityCode ) && Boolean( church.countryCode );
    }

    // ~~

    generateAlias(
        church
        )
    {
        return church.name
            .toLowerCase()
            .normalize( 'NFD' )
            .replace( /[\u0300-\u036f]/g, '' )
            .replace( /[^a-z0-9]+/g, '-' )
            .replace( /(^-|-$)/g, '' );
    }
}

// -- VARIABLES

export let churchService =
    new ChurchService();