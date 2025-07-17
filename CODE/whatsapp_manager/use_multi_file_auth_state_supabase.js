// -- IMPORTS

import { BufferJSON, initAuthCreds } from 'baileys';
import { getJsonObject, getJsonText } from './utils.js';

// -- TYPES

export async function useMultiFileAuthStateSupabase(
    instance,
    repository
    )
{
    let credsRow = await repository.query( 'INSTANCE_CREDS', { instance } );
    let creds = credsRow
        ? getJsonObject( credsRow.creds, BufferJSON.reviver )
        : initAuthCreds();

    return (
        {
            state:
                {
                    creds,
                    keys:
                        {
                            get: async ( type, ids ) =>
                                {
                                    let rows = await repository.query( 'INSTANCE_KEYS', { instance, type, id: ids } );
                                    let data = Object.fromEntries(
                                        rows.map(
                                            ( row ) => [ row.id, getJsonObject( row.data, BufferJSON.reviver ) ]
                                            )
                                        );

                                    return data;
                                },
                            set: async ( data ) =>
                                {
                                    for ( let [ type, entries ] of Object.entries( data ) )
                                    {
                                       for ( let [ id, value ] of Object.entries( entries ) )
                                        {
                                            if ( value )
                                            {
                                                await repository.upsert(
                                                    'INSTANCE_KEYS',
                                                    {
                                                        instance,
                                                        type,
                                                        id,
                                                        data: getJsonText( value, BufferJSON.replacer )
                                                    },
                                                    [ 'instance', 'type', 'id' ]
                                                    );
                                            }
                                            else
                                            {
                                                await repository.remove( 'INSTANCE_KEYS', { instance, type, id } );
                                            }
                                        }
                                    }
                                }
                        }
                },
            saveCreds: async () =>
                repository.upsert(
                    'INSTANCE_CREDS',
                    {
                        instance,
                        creds: getJsonText( creds, BufferJSON.replacer )
                    },
                    [ 'instance' ]
                    )
        }
        );
}
