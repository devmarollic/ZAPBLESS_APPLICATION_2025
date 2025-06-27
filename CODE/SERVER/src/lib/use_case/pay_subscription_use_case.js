// -- IMPORTS

import { getJsonObject, getJsonText, logError } from 'senselogic-gist';
import { mailer } from '../../mailer.js';
import { subscriptionService } from '../service/subscription_service';
import { pagarmeService } from '../service/pagarme_service';
import { PaymentStrategyFactory } from '../strategy/payment_strategy_factory';
import { NotFoundError } from '../errors/not_found';
import { ValidationError } from '../errors/validation_error';
import { subscriptionStatus } from '../model/subscription';
import { AppError } from '../errors/app_error';
import { abacatePayService } from '../service/abacate_pay_service.js';

// -- CONSTANTS

let paymentStatus =
{
    failed: 'failed'
};

// -- TYPES

class PaySubscriptionUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        try
        {
            this.validateInput( input );

            let subscriptionData = await subscriptionService.getSubscriptionWithDetailsById(
                input.subscriptionId
                );

            if ( !subscriptionData )
            {
                throw new NotFoundError( 'subscription-not-found' );
            }

            if ( !PaymentStrategyFactory.isValidPaymentMethod( input.paymentMethod ) )
            {
                throw new ValidationError( `Invalid payment method: ${ input.paymentMethod }` );
            }

            let paymentStrategy = PaymentStrategyFactory.createStrategy(
                input.paymentMethod,
                input.paymentMethod === 'pix' ? abacatePayService : pagarmeService
                );

            let customerData = this.prepareCustomerData( subscriptionData );

            let paymentResult = await paymentStrategy.processPayment(
                subscriptionData,
                input.paymentData,
                customerData
                );
            let isPaymentFailed = paymentResult.status === paymentStatus.failed;

            if ( input.paymentMethod === 'pix' )
            {
                return paymentResult;
            }

            await subscriptionService.setSubscriptionById(
                {
                    paymentGatewayId: paymentResult.id,
                    paymentMethodId: input.paymentMethod,
                    chargeInfo: paymentResult,
                    price: paymentResult.items[ 0 ].pricing_scheme.price / 100,
                    statusId: isPaymentFailed ? subscriptionStatus.refused : subscriptionStatus.paid
                },
                input.subscriptionId
                );

            await mailer.sendEmail(
                subscriptionData.church.profile[ 0 ].email,
                !isPaymentFailed ? 'Assinatura ativada com sucesso' : 'Pagamento não autorizado',
                !isPaymentFailed ? 'payment_successful' : 'payment_failed',
                {
                    customerName: subscriptionData.church.name,
                    planName: subscriptionData.plan.name,
                    amount: new Intl.NumberFormat( 'pt-BR', { style: 'currency', currency: subscriptionData.plan.currencyCode } ).format( paymentResult.items[ 0 ].pricing_scheme.price / 100 ),
                    nextBillingDate: paymentResult.next_billing_date,
                    invoiceUrl: paymentResult.checkouts?.[ 0 ]?.payment_url,
                    failureReasonSection: paymentResult.failure_reason,
                    nextAttemptSection: paymentResult.next_attempt,
                    retryUrl: paymentResult.retry_url
                }
                );

            if ( isPaymentFailed )
            {
                throw new AppError( 'payment-failed' );
            }
            
            return (
                {
                    subscriptionId: input.subscriptionId,
                    paymentId: paymentResult.id,
                    paymentMethod: input.paymentMethod,
                    status: paymentResult.status,
                    charges: paymentResult.charges,
                    checkoutUrl: paymentResult.checkouts?.[ 0 ]?.payment_url
                }
                );
        }
        catch ( error )
        {
            logError( 'PaySubscriptionUseCase error:', error );
            
            if ( input.subscriptionId )
            {
                try
                {
                    await subscriptionService.setSubscriptionById(
                        {
                            statusId: subscriptionStatus.failed
                        },
                        input.subscriptionId
                    );
                }
                catch ( updateError )
                {
                    logError( 'Failed to update subscription status:', updateError );
                }
            }

            throw error;
        }
    }

    // ~~

    validateInput(
        input
        )
    {
        let errorArray = [];

        if ( !input.subscriptionId || input.subscriptionId.trim() === '' )
        {
            errorArray.push( 'subscriptionId is required' );
        }

        if ( !input.paymentMethod || input.paymentMethod.trim() === '' )
        {
            errorArray.push( 'paymentMethod is required' );
        }

        if ( !input.paymentData || typeof input.paymentData !== 'object' )
        {
            errorArray.push( 'paymentData is required and must be an object' );
        }

        if ( errorArray.length > 0 )
        {
            throw new ValidationError( `Validation failed: ${ errorArray.join( ', ' ) }` );
        }
    }

    // ~~

    prepareCustomerData(
        subscriptionData
        )
    {
        let church = subscriptionData.church;
        let profile = church.profile[ 0 ];

        if ( !church.zipCode || !church.cityName || !church.stateCode )
        {
            throw new ValidationError( 'church-address-incomplete' );
        }

        return (
            {
                name: church.name,
                email: profile.email,
                document: church.documentNumber?.replace(/\D/g, ''),
                documentType: church.documentType === 'CNPJ' ? 'cnpj' : 'cpf',
                type: church.documentType === 'CNPJ' ? 'company' : 'individual',
                phoneNumber: profile.phoneNumber?.replace( /\D/g, '' ) || '11999999999',
                addressLine1: church.addressLine1,
                addressLine2: church.addressLine2,
                zipCode: church.zipCode?.replace(/\D/g, ''),
                city: church.cityName,
                state: church.stateCode,
                country: church.countryCode || 'BR'
            }
            );
    }
}

// -- VARIABLES

export let paySubscriptionUseCase =
    new PaySubscriptionUseCase();