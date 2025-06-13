// -- IMPORTS

import { getJsonObject, getJsonText, logError } from 'senselogic-gist';
import { subscriptionService } from '../service/subscription_service';
import { pagarmeService } from '../service/pagarme_service';
import { PaymentStrategyFactory } from '../strategy/payment_strategy_factory';
import { NotFoundError } from '../errors/not_found';
import { ValidationError } from '../errors/validation_error';
import { subscriptionStatus } from '../model/subscription';

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

            console.log( subscriptionData );
            
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
                pagarmeService
                );

            let customerData = this.prepareCustomerData( subscriptionData );

            let paymentResult = await paymentStrategy.processPayment(
                subscriptionData,
                input.paymentData,
                customerData
                );

            await subscriptionService.setSubscriptionById(
                {
                    statusId: 'pending',
                    paymentGatewayId: paymentResult.id,
                    paymentMethodId: input.paymentMethod,
                    chargeInfo: getJsonText( paymentResult )
                },
                input.subscriptionId
                );

            return (
                {
                success: true,
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

        return (
            {
                name: church.name,
                email: profile.email,
                document: church.documentNumber?.replace(/\D/g, ''),
                documentType: church.documentType === 'CNPJ' ? 'cnpj' : 'cpf',
                type: church.documentType === 'CNPJ' ? 'company' : 'individual',
                phoneNumber: profile.phoneNumber?.replace( /\D/g, '' ) || '11999999999'
            }
            );
    }
}

// -- VARIABLES

export let paySubscriptionUseCase =
    new PaySubscriptionUseCase();