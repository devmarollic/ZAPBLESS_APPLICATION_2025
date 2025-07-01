// -- IMPORTS

import { supabaseService } from './supabase_service.js';
import { getMap } from './utils.js';

// -- TYPES

class ContactService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedContactArray = null;
        this.cachedContactArrayTimestamp = null;
        this.cachedContactByNumberMap = null;
    }

    // -- INQUIRIES

    async getContactArray(
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CONTACT' )
            .select()
            .eq( 'churchId', process.env.CHURCH_ID );

        if ( error !== null )
        {
            console.error( error );
        }

        return data;
    }

    // ~~

    async getCachedContactArray(
        )
    {
        if ( this.cachedContactArray === null
             || this.cachedContactArrayTimestamp < Date.now() - 1000 * 60 * 60 * 24 )
        {
            this.cachedContactArray = await this.getContactArray();
            this.cachedContactArrayTimestamp = Date.now();
        }

        return this.cachedContactArray;
    }

    // ~~

    async getCachedContactByNumberMap(
        )
    {
        if ( this.cachedContactByNumberMap === null
             || this.cachedContactByNumberMapTimestamp < Date.now() - 1000 * 60 * 60 * 24 )
        {
            this.cachedContactByNumberMap = getMap( await this.getCachedContactArray(), 'number' );
            this.cachedContactByNumberMapTimestamp = Date.now();
        }

        return this.cachedContactByNumberMap;
    }

    // ~~

    async getContactByChuchId(
        chuchId
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CONTACT' )
            .select()
            .eq( 'churchId', chuchId );

        if ( error !== null )
        {
            console.error( error );
        }

        return data;
    }

    // -- OPERATIONS

    async upsertContact(
        contact
        )
    {
        let { data, error } = await supabaseService.getClient()
            .from( 'CONTACT' )
            .upsert( contact, { onConflict: 'number, churchId' } );

        if ( error !== null )
        {
            console.error( error );
        }

        return data;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedContactArray = null;
        this.cachedContactArrayTimestamp = null;
        this.cachedContactByNumberMap = null;
    }
}

// -- VARIABLES

export let contactService
    = new ContactService();