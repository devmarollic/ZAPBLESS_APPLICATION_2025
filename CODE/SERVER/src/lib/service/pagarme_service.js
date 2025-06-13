// -- IMPORTS

import { enviroment } from "../../enviroment";


// -- TYPES

export class PagarmeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.baseUrl = enviroment.PAGARME_BASE_URL;
        this.apiKey = enviroment.PAGARME_API_KEY;

        if ( !this.apiKey )
        {
            throw new Error( 'PAGARME_API_KEY missing' );
        }

        if ( !this.baseUrl )
        {
            throw new Error( 'PAGARME_BASE_URL missing' );
        }
    }

    // -- INQUIRIES

    async getHeaders(
        )
    {
        return (
            {
                'Authorization': 'Basic ' + Buffer.from( this.apiKey ).toString( 'base64' ),
                'Content-Type': 'application/json'
            }
            );
    }

    // ~~

    async paySubscription(
        subscriptionData
        )
    {
        let subscription = await fetch( this.baseUrl + '/subscriptions',
            {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify( subscriptionData )
            }
            );

        return subscription;
    }
}

// -- VARIABLES

export let pagarmeService
    = new PagarmeService();
