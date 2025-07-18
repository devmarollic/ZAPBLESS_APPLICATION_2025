// -- IMPORTS

import { getJsonObject, getJsonText } from './utils.js';
import { Curve, signedKeyPair } from './crypto.js'
import { randomBytes } from 'crypto';
import { generateRegistrationId } from './crypto.js';


export const KEY_BUNDLE_TYPE = Buffer.from([5])

export const generateSignalPubKey = (pubKey) =>
    pubKey.length === 33 ? pubKey : Buffer.concat([KEY_BUNDLE_TYPE, pubKey])

const initAuthCreds = () => {
    const identityKey = Curve.generateKeyPair()
    return {
        noiseKey: Curve.generateKeyPair(),
        pairingEphemeralKeyPair: Curve.generateKeyPair(),
        signedIdentityKey: identityKey,
        signedPreKey: signedKeyPair(identityKey, 1),
        registrationId: generateRegistrationId(),
        advSecretKey: randomBytes(32).toString('base64'),
        processedHistoryMessages: [],
        nextPreKeyId: 1,
        firstUnuploadedPreKeyId: 1,
        accountSyncCounter: 0,
        accountSettings: {
            unarchiveChats: false
        },
        registered: false,
        pairingCode: undefined,
        lastPropHash: undefined,
        routingInfo: undefined
    }
}

const BufferJSON = {
    replacer: (k, value) => {
        if (Buffer.isBuffer(value) || value instanceof Uint8Array || value?.type === 'Buffer') {
            return { type: 'Buffer', data: Buffer.from(value?.data || value).toString('base64') }
        }

        return value
    },

    reviver: (_, value) => {
        if (typeof value === 'object' && !!value && (value.buffer === true || value.type === 'Buffer')) {
            const val = value.data || value.value
            return typeof val === 'string' ? Buffer.from(val, 'base64') : Buffer.from(val || [])
        }

        return value
    }
}

// -- TYPES

export async function useMultiFileAuthStateSupabase(
    instance,
    repository
) {
    let credsRow = await repository.query('INSTANCE_CREDS', { instance });
    let creds = credsRow
        ? getJsonObject(credsRow.creds, BufferJSON.reviver)
        : initAuthCreds();

    return (
        {
            state:
            {
                creds,
                keys:
                {
                    get: async (type, ids) => {
                        let rows = await repository.query('INSTANCE_KEYS', { instance, type, id: ids });
                        let data = Object.fromEntries(
                            rows.map(
                                (row) => [row.id, getJsonObject(row.data, BufferJSON.reviver)]
                            )
                        );

                        return data;
                    },
                    set: async (data) => {
                        for (let [type, entries] of Object.entries(data)) {
                            for (let [id, value] of Object.entries(entries)) {
                                if (value) {
                                    await repository.upsert(
                                        'INSTANCE_KEYS',
                                        {
                                            instance,
                                            type,
                                            id,
                                            data: getJsonText(value, BufferJSON.replacer)
                                        },
                                        ['instance', 'type', 'id']
                                    );
                                }
                                else {
                                    await repository.remove('INSTANCE_KEYS', { instance, type, id });
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
                        creds: getJsonText(creds, BufferJSON.replacer)
                    },
                    ['instance']
                )
        }
    );
}
