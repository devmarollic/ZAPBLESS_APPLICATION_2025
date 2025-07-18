import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'crypto';
import * as libsignal from 'libsignal';

export const Curve = {
    generateKeyPair: () => {
        const { pubKey, privKey } = libsignal.curve.generateKeyPair()
        return {
            private: Buffer.from(privKey),
            // remove version byte
            public: Buffer.from((pubKey).slice(1))
        }
    },
    sharedKey: (privateKey, publicKey) => {
        const shared = libsignal.curve.calculateAgreement(generateSignalPubKey(publicKey), privateKey)
        return Buffer.from(shared)
    },
    sign: (privateKey, buf) => libsignal.curve.calculateSignature(privateKey, buf),
    verify: (pubKey, message, signature) => {
        try {
            libsignal.curve.verifySignature(generateSignalPubKey(pubKey), message, signature)
            return true
        } catch (error) {
            return false
        }
    }
}


export const signedKeyPair = (identityKeyPair, keyId) => {
    const preKey = Curve.generateKeyPair()
    const pubKey = generateSignalPubKey(preKey.public)

    const signature = Curve.sign(identityKeyPair.private, pubKey)

    return { keyPair: preKey, signature, keyId }
}

export const generateRegistrationId = () => {
    return Uint16Array.from(randomBytes(2))[0] & 16383
}