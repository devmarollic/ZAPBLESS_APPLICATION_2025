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
                customer:
                {
                    address:
                        {
                            country: customerData.country,
                            state: customerData.state,
                            city: customerData.city,
                            zip_code: customerData.zipCode,
                            line_1: customerData.addressLine1,
                            line_2: customerData.addressLine2
                        },
                    name: customerData.name,
                    type: customerData.type,
                    email: customerData.email,
                    code: customerData.id,
                    document: customerData.document,
                    document_type: customerData.documentType,
                    gender: customerData.gender,
                    birthdate: customerData.birthdate,
                    phones:
                            {
                                mobile_phone:
                                    {
                                        country_code: '55',
                                        area_code: customerData.phoneNumber.slice( 0, 2 ),
                                        number: customerData.phoneNumber.slice( 2 )
                                    }
                            },
                },
                card:
                    {
                        billing_address:
                            {
                                line_1: customerData.addressLine1,
                                line_2: customerData.addressLine2,
                                zip_code: customerData.zipCode,
                                city: customerData.city,
                                state: customerData.state,
                                country: customerData.country
                            },
                        number: cleanCardNumber,
                        holder_name: customerData.name,
                        holder_document: customerData.document,
                        exp_month: getInteger( month, 10 ),
                        exp_year: getInteger( fullYear, 10 ),
                        cvv: paymentData.cvv
                    },
                installments: 1,
                plan_id: 'plan_mx2W48xrU3hm4PB3',
                code: subscriptionData.id,
                payment_method: 'debit_card'
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