// -- IMPORTS

import { ProviderFiles } from './provider_file_service.js';
import { AuthenticationCreds, AuthenticationState, BufferJSON, initAuthCreds, proto, SignalDataTypeMap } from 'baileys';

// -- TYPES

export class AuthStateProvider
{
    // --
    constructor(
        providerFiles
        )
    {
        this.providerFiles = providerFiles;
    }

    // -- INQUIRIES

    async authStateProvider(
        instance
        )
    {
        let [ , error ] = await this.providerFiles.create( instance );

        if ( error )
        {
            logError( error );

            return;
        }

        let writeData = async ( data, key ) =>
            {
                let json = getJsonText( data, BufferJSON.replacer );
                let [ response, error ] = await this.providerFiles.write( instance, key, json );

                if ( error )
                {
                    logError( error );
                }

                return response;
            };

        let readData = async ( key ) =>
            {
                let [ response, error ] = await this.providerFiles.read( instance, key );

                if ( error )
                {
                    logError( error );
                }

                return response;
            };

        let removeData = async ( key ) =>
            {
                let [ response, error ] = await this.providerFiles.delete( instance, key );

                if ( error )
                {
                    logError( error );
                }

                return;
            };

        let creds = (await readData( 'creds' )) || initAuthCreds();

        return (
            {
                state:
                    {
                        creds,
                        keys:
                            {
                                get: async ( type, ids ) => {
                                    let data = {};

                                    await Promise.all(
                                        ids.map(async ( id ) =>
                                            {
                                                let value = await readData(`${ type }-${ id }`);
                                                if ( type === 'app-state-sync-key' && value )
                                                {
                                                    value = proto.Message.AppStateSyncKeyData.fromObject( value );
                                                }

                                                data[ id ] = value;
                                            }
                                            )
                                        );

                                    return data;
                                },
                                set: async ( data ) =>
                                {
                                    let tasks = [];

                                    for ( let category in data )
                                    {
                                        for ( let id in data[category] )
                                        {
                                            let value = data[category][id];
                                            let key = `${category}-${id}`;

                                            tasks.push(
                                                value
                                                    ? await writeData( value, key )
                                                    : await removeData( key )
                                                );
                                        }
                                    }

                                    await Promise.all( tasks );
                                }
                            }
                    },
                saveCreds: async () =>
                    {
                        return await writeData( creds, 'creds' );
                    }
            }
            );
    }
}
