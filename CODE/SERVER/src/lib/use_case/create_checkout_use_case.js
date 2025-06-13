// -- IMPORTS

import { getJsonObject, getJsonText, getRandomTuid } from 'senselogic-gist';
import { paymentGatewayService } from '../service/payment_gateway_service';
import { planService } from '../service/plan_service';
import { subscriptionService } from '../service/subscription_service';
import { NotFoundError } from '../errors/not_found';
import { enviroment } from '../../enviroment';

// -- TYPES

class CreateCheckoutUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let plan = await planService.getPlanById( input.planId );

        if ( plan === null )
        {
            throw new NotFoundError( 'plan-not-found' );
        }

        let planPeriod = input.isAnnual ? 'annualPrice' : 'monthlyPrice';
        let planPriceCentCount = plan[ planPeriod ];
        let startAtDate = new Date();
        let expiresAtDate = new Date( startAtDate );

        if ( input.isAnnual )
        {
            expiresAtDate.setFullYear( expiresAtDate.getFullYear() + 1 );
        }
        else
        {
            expiresAtDate.setMonth( expiresAtDate.getMonth() + 1 );
        }

        let subscription = await subscriptionService.addSubscription(
            {
                id: getRandomTuid(),
                churchId: input.churchId,
                planId: input.planId,
                typeId: input.typeId,
                statusId: 'pending',
                periodId: input.isAnnual ? 'annual' : 'monthly',
                startAtDateTimestamp: startAtDate,
                expiresAtDateTimestamp: expiresAtDate,
                paymentMethodId: input.paymentMethodId
            }
            );

        let paymentGatewayCheckout = await paymentGatewayService.createCheckout(
            {
                payment_method: input.paymentMethodId,
                plan_id: plan.id,
                customer: input.customerData,
                postback_url: enviroment.BASE_URL + '/api/webhook/pagarme',
                metadata:
                    {
                        subscription_id: subscription.id
                    },
                items:
                    [
                        {
                            id: plan.id,
                            description: plan.name,
                            quantity: 1,
                            amount: planPriceCentCount
                        }
                    ]
            }
            );

        await subscriptionService.setSubscriptionById(
            {
                paymentGatewayId: paymentGatewayCheckout.id,
                paymentMethodId: input.paymentMethodId,
                chargeInfo: getJsonText( paymentGatewayCheckout )
            },
            subscription.id
            );

        return (
            {
                subscriptionId: subscription.id,
                checkoutData: paymentGatewayCheckout
            }
            );
    }
}

// -- VARIABLES

export const createCheckoutUseCase
    = new CreateCheckoutUseCase();