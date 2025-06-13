// -- IMPORTS

import { PaymentStrategy } from './payment_strategy.js';
import { getJsonText } from 'senselogic-gist';

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
        let priceInCents = subscriptionData.periodId === 'monthly' 
            ? subscriptionData.plan.monthlyPrice * 100 
            : subscriptionData.plan.annualPrice * 100;

        let dueDate = new Date();
        dueDate.setDate( dueDate.getDate() + 7 );
        let dueDateISO = dueDate.toISOString().split( 'T' )[ 0 ];

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
                            payment_method: 'boleto',
                            boleto:
                                {
                                    due_at: dueDateISO,
                                    instructions: `Pagamento da assinatura ZapBless ${ subscriptionData.plan.name }. Válido até ${ dueDate.toLocaleDateString( 'pt-BR' ) }.`,
                                    interest:
                                        {
                                            days: 1,
                                            type: 'percentage',
                                            amount: 200
                                        },
                                    fine:
                                        {
                                            days: 1,
                                            type: 'percentage',  
                                            amount: 200
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
        
        let headers = await this.pagarmeService.getHeaders();
        let response = await fetch(
            this.pagarmeService.baseUrl + '/orders',
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