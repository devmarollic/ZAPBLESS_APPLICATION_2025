// -- IMPORTS

import { PaymentStrategy } from './payment_strategy.js';
import { getInteger, getJsonText, getRoundInteger } from 'senselogic-gist';

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
        let priceInCents = getRoundInteger(
            subscriptionData.periodId === 'monthly' 
                ? Number( subscriptionData.plan.monthlyPrice ) * 100 
                : Number( subscriptionData.plan.annualPrice ) * 100
            );

        let cleanCardNumber = paymentData.cardNumber.replace( /\s+/g, '' ).replace( /\D/g, '' );
        
        let [ month, year ] = paymentData.expiryDate.split( '/' );
        let fullYear = `20${ year }`;

        return (
            {
                payment_method: 'credit_card',
                interval: subscriptionData.periodId === 'monthly' ? 'month' : 'year',
                interval_count: 1,
                billing_type: 'prepaid',
                installments: 1,
                customer:
                    {
                        name: customerData.name,
                        email: customerData.email,
                        document_type: customerData.documentType,
                        document: customerData.document,
                        type: customerData.type,
                        phones:
                            {
                                mobile_phone:
                                    {
                                        country_code: '55',
                                        area_code: customerData.phoneNumber.slice( 0, 2 ),
                                        number: customerData.phoneNumber.slice( 2 )
                                    }
                            },
                        address:
                            {
                                line_1: customerData.addressLine1,
                                line_2: customerData.addressLine2,
                                zip_code: customerData.zipCode,
                                city: customerData.city,
                                state: customerData.state,
                                country: customerData.country || 'BR'
                            }
                    },
                card:
                    {
                        number: cleanCardNumber,
                        holder_name: paymentData.holderName,
                        exp_month: getInteger( month, 10 ),
                        exp_year: getInteger( fullYear, 10 ),
                        cvv: paymentData.cvv,
                        billing_address:
                            {
                                line_1: customerData.addressLine1,
                                line_2: customerData.addressLine2,
                                zip_code: customerData.zipCode,
                                city: customerData.city,
                                state: customerData.state,
                                country: customerData.country || 'BR'
                            }
                    },
                items:
                    [
                        {
                            description: `${ subscriptionData.plan.name } ${ subscriptionData.periodId === 'monthly' ? 'Mensal' : 'Anual' }`,
                            name: subscriptionData.plan.name,
                            quantity: 1,
                            pricing_scheme:
                                {
                                    scheme_type: 'unit',
                                    price: priceInCents
                                }
                        }
                    ],
                currency: subscriptionData.plan.currencyCode,
                description: `ZapBless ${ subscriptionData.plan.name }`,
                start_at: new Date().toISOString(),
                statement_descriptor: 'ZAPBLESS'
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

        let headers = this.pagarmeService.getHeaders();
        let response = await fetch(
            this.pagarmeService.baseUrl + '/subscriptions', 
            {
                method: 'POST',
                headers,
                body: getJsonText( payload )
            }
            );


        console.log( JSON.stringify( payload, null, 2 ) );
        console.log( this.pagarmeService.getHeaders() );


        if ( !response.ok )
        {
            throw new Error( `Credit card payment failed: ${ response.statusText }` );
        }

        let result = await response.json();

        return result;
    }
} 