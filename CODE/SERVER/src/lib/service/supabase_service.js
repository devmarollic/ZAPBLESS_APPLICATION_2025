// -- IMPORTS

import { createServerClient } from '@supabase/ssr';
import { enviroment } from '../../enviroment';

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
        return createServerClient(
            enviroment.ZAPBLESS_PROJECT_SUPABASE_DATABASE_URL,
            enviroment.ZAPBLESS_PROJECT_SUPABASE_DATABASE_KEY,
            {
                cookies:
                {
                    get:
                        ( key ) =>
                        {
                            if ( request
                                    && request.cookies )
                            {
                                return decodeURIComponent( request.cookies[ key ] ?? '' )
                            }
                            else
                            {
                                return '';
                            }
                        },
                    set:
                        ( key, value, options ) =>
                        {
                            if ( reply )
                            {
                                reply.cookie(
                                    key,
                                    encodeURIComponent( value ),
                                    {
                                        ...options,
                                        sameSite: 'Lax',
                                        httpOnly: true
                                    }
                                    );
                            }
                        },
                    remove:
                        ( key, options ) =>
                        {
                            if ( reply )
                            {
                                reply.cookie(
                                    key,
                                    '',
                                    {
                                        ...options,
                                        httpOnly: true
                                    }
                                    );
                            }
                        }
                }
            }
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
                .from( enviroment.ZAPBLESS_PROJECT_SUPABASE_STORAGE_URL )
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
                .from( enviroment.ZAPBLESS_PROJECT_SUPABASE_STORAGE_URL )
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
