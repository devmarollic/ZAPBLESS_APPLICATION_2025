// -- IMPORTS

import { getLocalizedText } from 'senselogic-gist';
import { Capacitor } from '@capacitor/core';

// -- CONSTANTS

export const platform = Capacitor.getPlatform();
export const hostUrl = ( platform === 'android' ? 'https://fusion-project.com/' : '' );

// -- VARIABLES

export let monthNameArray =
    [
        'January¨fr:Janvier',
        'February¨fr:Février',
        'March¨fr:Mars',
        'April¨fr:Avril',
        'May¨fr:May',
        'June¨fr:Juin',
        'July¨fr:Juillet',
        'August¨fr:Août',
        'September¨fr:Septembre',
        'October¨fr:Octobre',
        'November¨fr:Novembre',
        'December¨fr:Décembre'
    ];

export let weekdayNameArray =
    [
        'Monday¨fr:Lundi',
        'Tuesday¨fr:Mardi',
        'Wednesday¨fr:Mercredi',
        'Thursday¨fr:Jeudi',
        'Friday¨fr:Vendredi',
        'Saterday¨fr:Samedi',
        'Sunday¨fr:Dimanche'
    ];

// -- FUNCTIONS

export function getHostRoute(
    route
    )
{
    return hostUrl + route;
}

// ~~

export function getShortenedName(
    name,
    maximumCharacterCount = undefined
    )
{
    if ( maximumCharacterCount === undefined )
    {
        return name;
    }
    else
    {
        return name.slice( 0, maximumCharacterCount );
    }
}

// ~~

export function getLocalizedNameArray(
    nameArray,
    maximumCharacterCount = undefined
    )
{
    return nameArray.map( name => getShortenedName( getLocalizedText( name ), maximumCharacterCount ) );
}

// ~~

export function getLocalizedMonthNameArray(
    maximumCharacterCount = undefined
    )
{
    return getLocalizedNameArray( monthNameArray, maximumCharacterCount );
}

// ~~

export function getLocalizedWeekdayNameArray(
    maximumCharacterCount = undefined
    )
{
    return getLocalizedNameArray( weekdayNameArray, maximumCharacterCount );
}

// ~~

export function getLocalizedMonthName(
    monthIndex,
    maximumCharacterCount = undefined
    )
{
    return getLocalizedText( monthNameArray[ monthIndex ] );
}

// ~~

export function getLocalizedWeekdayName(
    weekdayIndex,
    maximumCharacterCount = undefined
    )
{
    return getLocalizedText( weekdayNameArray[ weekdayIndex ] );
}

// -- STATEMENTS
