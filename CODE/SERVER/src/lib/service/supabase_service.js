// -- IMPORTS

import { createServerClient } from '@supabase/ssr';

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

    getClient(
        request,
        reply
        )
    {
        if ( this.client === null )
        {
            this.client =
                createServerClient(
                    process.env.ZAPBLESS_PROJECT_SUPABASE_DATABASE_URL,
                    process.env.ZAPBLESS_PROJECT_SUPABASE_DATABASE_KEY,
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
                .from( process.env.ZAPBLESS_PROJECT_SUPABASE_STORAGE_URL )
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
                .from( process.env.ZAPBLESS_PROJECT_SUPABASE_STORAGE_URL )
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
