// -- IMPORTS

import { PaymentStrategy } from './payment_strategy.js';
import { getJsonText, getRoundInteger } from 'senselogic-gist';

// -- TYPES

export class PixPaymentStrategy extends PaymentStrategy {
    // -- CONSTRUCTORS

    constructor(
        abacatePayService
    ) {
        super();
        this.abacatePayService = abacatePayService;
    }

    // -- OPERATIONS

    validatePaymentData(
        paymentData
    ) {
        let errorArray = [];

        if (!paymentData.cpf
            || paymentData.cpf.trim() === '') {
            errorArray.push('CPF is required for pix payment');
        }

        if (errorArray.length > 0) {
            throw new Error(`Pix validation failed: ${errorArray.join(', ')}`);
        }

        return true;
    }

    // ~~

    buildPaymentPayload(
        subscriptionData,
        paymentData,
        customerData
    ) {
        let priceInCents = getRoundInteger(
            subscriptionData.periodId === 'monthly'
                ? subscriptionData.plan.monthlyPrice * 100
                : subscriptionData.plan.annualPrice * 100
        );

        let dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        let dueDateISO = dueDate.toISOString().split('T')[0];

        console.log( { taxId: paymentData.cpf } );
        return (
            {
                frequency: 'ONE_TIME',
                methods: [
                    'PIX'
                ],
                products: [
                    {
                        externalId: subscriptionData.id,
                        name: subscriptionData.plan.name,
                        description: subscriptionData.plan.description,
                        quantity: 1,
                        price: priceInCents
                    }
                ],
                returnUrl: 'https://example.com/billing',
                completionUrl: 'http://localhost:3000/login',
                customerId: customerData.id,
                customer: {
                    name: customerData.name,
                    cellphone: customerData.phoneNumber,
                    email: customerData.email,
                    taxId: paymentData.cpf
                },
                allowCoupons: false
            }
        );
    }

    // ~~

    async processPayment(
        subscriptionData,
        paymentData,
        customerData
    ) {
        this.validatePaymentData(paymentData);

        let payload = this.buildPaymentPayload(subscriptionData, paymentData, customerData);
        let response = await this.abacatePayService.paySubscription(payload);    
        
        if (!response.ok) {
            throw new Error(`Pix payment failed: ${response.statusText}`);
        }

        let result = await response.json();

        console.log(result);

        return result;
    }
} 