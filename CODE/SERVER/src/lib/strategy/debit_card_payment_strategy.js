// -- IMPORTS

import { PaymentStrategy } from './payment_strategy.js';
import { getInteger, getJsonText, getRoundInteger } from 'senselogic-gist';

// -- TYPES

export class DebitCardPaymentStrategy extends PaymentStrategy
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
        let errorArray = [];

        if ( !paymentData.cardNumber
             || paymentData.cardNumber.trim() === '' )
        {
            errorArray.push( 'Card number is required' );
        }

        if ( !paymentData.expiryDate
             || paymentData.expiryDate.trim() === '' )
        {
            errorArray.push( 'Expiry date is required' );
        }

        if ( !paymentData.cvv
             || paymentData.cvv.trim() === '' )
        {
            errorArray.push('CVV is required');
        }

        if ( !paymentData.holderName
             || paymentData.holderName.trim() === '' )
        {
            errorArray.push( 'Holder name is required' );
        }

        if ( errorArray.length > 0 )
        {
            throw new Error( `Debit card validation failed: ${ errorArray.join( ', ' ) }` );
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
                ? subscriptionData.plan.monthlyPrice * 100 
                : subscriptionData.plan.annualPrice * 100
            );

        let cleanCardNumber = paymentData.cardNumber.replace( /\s+/g, '' ).replace( /\D/g, '' );
        
        let [ month, year ] = paymentData.expiryDate.split( '/' );
        let fullYear = `20${ year }`;

        return (
            {
                payment_method: 'debit_card',
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
                            }
                    },
                card:
                    {
                        number: cleanCardNumber,
                        holder_name: paymentData.holderName,
                        exp_month: getInteger( month, 10 ),
                        exp_year: getInteger( fullYear, 10 ),
                        cvv: paymentData.cvv
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
                currency: 'BRL',
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

        if ( !response.ok )
        {
            throw new Error( `Debit card payment failed: ${ response.statusText }` );
        }

        let result = await response.json();

        return result;
    }
} 