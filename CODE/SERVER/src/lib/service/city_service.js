// -- IMPORTS

import { supabaseService } from './supabase_service';
import { logError } from 'senselogic-gist';

// -- TYPES

class CityService
{
    // -- CONSTRUCTOR

    constructor(
        )
    {
        this.cachedCityArray = null;
        this.cachedCityByProvinceCodeMap = null;
        this.cachedCityArrayTimestamp = null;
    }

    // -- INQUIRIES

    async getCityArray(
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CITY' )
            .select()
            .order( 'provinceCode', { ascending: true } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCityByCode(
        code
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CITY' )
            .select( '*' )
            .eq( 'code', code )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCityArrayByProvinceCode(
        provinceCode
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CITY' )
            .select( '*' )
            .eq( 'provinceCode', provinceCode )
            .order( 'name', { ascending: true } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async getCachedCityArray(
        )
    {
        if ( this.cachedCityArray === null
             || Date.now() > this.cachedCityArrayTimestamp + 300000 )
        {
            this.cachedCityArray = await this.getCityArray();
            this.cachedCityArrayTimestamp = Date.now();
        }

        return this.cachedCityArray;
    }

    // ~~

    async getCachedCityByProvinceCodeMap(
        )
    {
        if ( this.cachedCityByProvinceCodeMap === null
             || Date.now() > this.cachedCityArrayTimestamp + 300000 )
        {
            this.cachedCityByProvinceCodeMap = {};
            let cityArray = await this.getCachedCityArray();
            let cityCount = cityArray.length;

            for ( let cityIndex = 0; cityIndex < cityCount; cityIndex++ )
            {
                let city = cityArray[ cityIndex ];

                if ( !this.cachedCityByProvinceCodeMap[ city.provinceCode ] )
                {
                    this.cachedCityByProvinceCodeMap[ city.provinceCode ] = [];
                }

                this.cachedCityByProvinceCodeMap[ city.provinceCode ].push( city );
            }
        }

        return this.cachedCityByProvinceCodeMap;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedCityArray = null;
        this.cachedCityByProvinceCodeMap = null;
        this.cachedCityArrayTimestamp = null;
    }
}

// -- VARIABLES

export let cityService = new CityService();