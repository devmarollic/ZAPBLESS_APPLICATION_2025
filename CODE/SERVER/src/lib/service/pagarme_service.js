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
        
        // Ensure the base URL includes the version suffix expected by the API
        if ( this.baseUrl?.endsWith( '/core/v' ) )
        {
            this.baseUrl = this.baseUrl + '5';
        }

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

    getHeaders(
        )
    {
        return (
            {
                'Authorization': 'Basic ' + Buffer.from( this.apiKey + ':' ).toString( 'base64' ),
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
