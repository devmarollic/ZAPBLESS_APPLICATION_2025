// -- IMPORTS

// -- TYPES

export class PaymentStrategy
{
    // -- OPERATIONS

    async processPayment(
        subscriptionData,
        paymentData,
        customerData
        )
    {
        throw new Error( 'processPayment method must be implemented' );
    }

    // ~~

    validatePaymentData(
        paymentData
        )
    {
        throw new Error( 'validatePaymentData method must be implemented' );
    }

    // ~~

    buildPaymentPayload(
        subscriptionData,
        paymentData,
        customerData
        )
    {
        throw new Error( 'buildPaymentPayload method must be implemented' );
    }
} 