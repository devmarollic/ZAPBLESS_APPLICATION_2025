// -- IMPORTS

import { PaymentStrategy } from './payment_strategy.js';
import { getJsonText } from 'senselogic-gist';

// -- TYPES

export class CreditCardPaymentStrategy extends PaymentStrategy
{
    // -- CONSTRUCTORS

    constructor(
        pagarmeService
        )
    {
        super();
        this.pagarmeService = pagarmeService;
    }

    // -- OPERATIONS

    validatePaymentData(
        paymentData
        )
    {
        const errors = [];

        if ( !paymentData.cardNumber
            || paymentData.cardNumber.trim() === '' )
        {
            errors.push( 'Card number is required' );
        }

        if ( !paymentData.expiryDate
             || paymentData.expiryDate.trim() === '' )
        {
            errors.push( 'Expiry date is required' );
        }

        if ( !paymentData.cvv
             || paymentData.cvv.trim() === '' )
        {
            errors.push( 'CVV is required' );
        }

        if ( !paymentData.holderName
             || paymentData.holderName.trim() === '' )
        {
            errors.push( 'Holder name is required' );
        }

        if ( errors.length > 0 )
        {
            throw new Error( `Credit card validation failed: ${ errors.join( ', ' ) }` );
        }

        return true;
    }

    // ~~

    buildPaymentPayload(
        subscriptionData,
        paymentData,
        customerData
        )
    {
        let priceInCents = subscriptionData.periodId === 'monthly' 
            ? subscriptionData.plan.monthlyPrice * 100 
            : subscriptionData.plan.annualPrice * 100;

        let cleanCardNumber = paymentData.cardNumber.replace( /\s+/g, '' ).replace( /\D/g, '' );
        
        let [ month, year ] = paymentData.expiryDate.split( '/' );
        let fullYear = `20${year}`;

        return (
            {
                customer:
                    {
                        name: customerData.name,
                        email: customerData.email,
                        document: customerData.document,
                        document_type: customerData.documentType,
                        type: customerData.type,
                        phones:
                            {
                                mobile_phone:
                                    {
                                        country_code: '55',
                                        area_code: customerData.phoneNumber.slice( 0, 2 ),
                                        number: customerData.phoneNumber.slice( 2 )
                                    }
                            }
                    },
                items:
                    [
                        {
                            id: subscriptionData.plan.id,
                            description: `${ subscriptionData.plan.name } ${ subscriptionData.periodId === 'monthly' ? 'Mensal' : 'Anual' }`,
                            amount: priceInCents,
                            quantity: 1
                        }
                    ],
                payments:
                    [
                        {
                            payment_method: 'credit_card',
                            credit_card: {
                                installments: 1,
                                statement_descriptor: `ZapBless ${ subscriptionData.plan.name }`,
                                card:
                                    {
                                        number: cleanCardNumber,
                                        holder_name: paymentData.holderName,
                                        exp_month: parseInt( month, 10 ),
                                        exp_year: parseInt( fullYear, 10 ),
                                        cvv: paymentData.cvv
                                    }
                            }
                        }
                    ]
            }
            );
    }

    // ~~

    async processPayment(
        subscriptionData,
        paymentData,
        customerData
        )
    {
        this.validatePaymentData( paymentData );
        
        let payload = this.buildPaymentPayload( subscriptionData, paymentData, customerData );

        console.log( { subscriptionData, paymentData, customerData } );
        
        let headers = await this.pagarmeService.getHeaders();
        let response = await fetch( this.pagarmeService.baseUrl + '/orders', 
            {
                method: 'POST',
                headers,
                body: getJsonText( payload )
            }
            );
        
        console.log( { payload } );

        if ( !response.ok )
        {
            throw new Error( `Credit card payment failed: ${ response.statusText }` );
        }

        let result = await response.json();

        return result;
    }
} 