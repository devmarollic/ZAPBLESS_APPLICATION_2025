// -- IMPORTS

import { ProviderFiles } from './provider_file_service.js';
import pkg from '@whiskeysockets/baileys';
const { AuthenticationCreds, AuthenticationState, proto, SignalDataTypeMap } = pkg;
import { BufferJSON, initAuthCreds } from '@whiskeysockets/baileys';
import { getJsonText, isNotEmpty, logError } from './utils.js';

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
                    // Não loga erro para arquivos que não existem (comum durante inicialização)
                    if ( error.code !== 'ENOENT' )
                    {
                        logError( error );
                    }
                    return undefined;
                }

                if ( isNotEmpty( response?.data ) )
                {
                    try
                    {
                        // Tenta fazer parse direto primeiro
                        let parsedData = JSON.parse( response.data, BufferJSON.reviver );
                        
                        // Se o resultado tem uma propriedade 'data', extrai o conteúdo interno
                        if ( parsedData && typeof parsedData === 'object' && parsedData.data )
                        {
                            if ( typeof parsedData.data === 'string' )
                            {
                                return JSON.parse( parsedData.data, BufferJSON.reviver );
                            }
                            else
                            {
                                return parsedData.data;
                            }
                        }
                        
                        return parsedData;
                    }
                    catch ( parseError )
                    {
                        // Não loga erro de parsing para arquivos que podem estar corrompidos
                        if ( key === 'creds' )
                        {
                            logError( `Error parsing credentials for key ${key}:`, parseError );
                        }
                        return undefined;
                    }
                }
                
                return undefined;
            };

        let removeData = async ( key ) =>
            {
                let [ response, error ] = await this.providerFiles.delete( instance, key );

                if ( error )
                {
                    // Não loga erro para arquivos que não existem
                    if ( error.code !== 'ENOENT' )
                    {
                        logError( error );
                    }
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
