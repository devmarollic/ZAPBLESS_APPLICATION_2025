// -- IMPORTS

import { PaymentStrategy } from './payment_strategy.js';
import { getJsonText, getRoundInteger } from 'senselogic-gist';

// -- TYPES

export class BoletoPaymentStrategy extends PaymentStrategy
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

        if ( !paymentData.cpf
             || paymentData.cpf.trim() === '' )
        {
            errorArray.push( 'CPF is required for boleto payment' );
        }

        if ( errorArray.length > 0 )
        {
            throw new Error( `Boleto validation failed: ${ errorArray.join( ', ' ) }` );
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

        let dueDate = new Date();
        dueDate.setDate( dueDate.getDate() + 7 );
        let dueDateISO = dueDate.toISOString().split( 'T' )[ 0 ];

        return (
            {
                payment_method: 'boleto',
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
                boleto_due_days: 7,
                boleto:
                    {
                        due_at: dueDateISO,
                        instructions: `Pagamento da assinatura ZapBless ${ subscriptionData.plan.name }. Válido até ${ dueDate.toLocaleDateString( 'pt-BR' ) }.`
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
            throw new Error( `Boleto payment failed: ${ response.statusText }` );
        }

        let result = await response.json();

        return result;
    }
} 