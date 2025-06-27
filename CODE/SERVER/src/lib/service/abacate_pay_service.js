// -- IMPORTS

import { enviroment } from "../../enviroment";


// -- TYPES

export class AbacatePayService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.baseUrl = enviroment.ABACATE_PAY_BASE_URL || 'https://api.abacatepay.com.br/v1';
        this.apiKey = enviroment.ABACATE_PAY_API_KEY || 'abc_dev_jNGGNam5YB03yKAuDJ0LgALZ';

        if ( !this.apiKey )
        {
            throw new Error( 'ABACATE_PAY_API_KEY missing' );
        }

        if ( !this.baseUrl )
        {
            throw new Error( 'ABACATE_PAY_BASE_URL missing' );
        }
    }

    // -- INQUIRIES

    getHeaders(
        )
    {
        return (
            {
                'Authorization': 'Bearer ' + this.apiKey,
                'Content-Type': 'application/json'
            }
            );
    }

    // ~~

    async paySubscription(
        subscriptionData
        )
    {
        let subscription = await fetch( this.baseUrl + '/billing/create',
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

export let abacatePayService
    = new AbacatePayService();
