// -- IMPORTS

import { createClient } from '@supabase/supabase-js';

// -- STATEMENTS

class SupabaseService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.client = null;
    }

    // -- OPERATIONS

    createClient(
        request,
        reply
        )
    {
        return createClient(
            process.env.SUPABASE_DATABASE_URL,
            process.env.SUPABASE_DATABASE_KEY
            );
    }

    getClient(
        request,
        reply
        )
    {
        if ( this.client === null )
        {
            this.client = this.createClient( request, reply );
        }

        return this.client;
    }

    // ~~

    async uploadFile(
        localFile,
        storageFilePath,
        storageFileIsOverwritten = false
        )
    {
        let { data, error } =
            await this.getClient()
                .storage
                .from( process.env.SUPABASE_STORAGE_URL )
                .upload(
                      storageFilePath,
                      localFile,
                      {
                          cacheControl: '3600',
                          upsert: storageFileIsOverwritten
                      }
                      );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeFile(
        storageFilePath
        )
    {
        let { data, error } =
            await this.getClient()
                .storage
                .from( w.SUPABASE_STORAGE_URL )
                .remove( [ storageFilePath ] );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let supabaseService
    = new SupabaseService();
