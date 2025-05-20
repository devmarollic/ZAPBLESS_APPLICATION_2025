// -- IMPORTS

import pagarme from 'pagarme';

// -- CONSTANTS


// -- TYPES

class PaymentGatewayService
{
    // -- INQUIRIES

    getClient(
        )
    {
        return pagarme.client.connect(
            {
                api_key: process.env.ZAPBLES_PROJECT_PAGARME_API_KEY
            }
            );
    }

    // -- OPERATIONS

    async createCheckout(
        checkoutData
        )
    {
        let client = await this.getClient();
        let charge = await client
            .subscriptions
            .create(
                checkoutData
                );

        return charge;
    }
}

// -- VARIABLES

export let paymentGatewayService
    = new PaymentGatewayService();
