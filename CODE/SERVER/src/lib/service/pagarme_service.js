// -- IMPORTS

import pagarme from 'pagarme';

// -- CONSTANTS

export const
    pagarmeApiKey = 'pk_test_w519v4aIMYcNY0bx';

// -- TYPES

class PagarmeService
{
    // -- INQUIRIES

    async getClient(
        )
    {
        let client = await pagarme.client.connect(
            {
                encryption_key: pagarmeApiKey
            }
        );

        return client;
    }
}

// -- VARIABLES

export let pagarmeService
    = new PagarmeService();
