// -- IMPORTS

import { subscriptionService } from '../service/subscription_service';
import { planService } from '../service/plan_service';
import { ValidationError } from '../errors/validation_error';
import { subscriptionStatus, subscriptionType } from '../model/subscription';
import { getJsonObject } from 'senselogic-gist';

// -- TYPES

class GetActivePlanDetailsUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let subscription = await subscriptionService.getSubscriptionByChurchId( input.churchId );
        
        if ( !subscription )
        {
            return (
                {
                    activePlan: null,
                    nextBilling: null,
                    invoiceHistoryArray: []
                }
                );
        }

        await planService.getCachedPlanArray();
        let plan = planService.cachedPlanByIdMap[ subscription.planId ];
        
        if ( !plan )
        {
            throw new ValidationError( 'Plan not found' );
        }

        let activePlan = subscription;
        let nextBilling = null;

        if ( subscription.typeId === subscriptionType.active
             && subscription.statusId === subscriptionStatus.paid )
        {
            nextBilling =
                {
                    planName: plan.name,
                    date: subscription.expiresAtDateTimestamp,
                    amount: subscription.periodId === 'monthly' ? plan.monthlyPrice : plan.annualPrice,
                    currency: plan.currencyCode || 'BRL',
                    periodId: subscription.periodId
                };
        }

        let invoiceHistoryArray = [{
            date: subscription.startAtDateTimestamp,
            planName: plan.name,
            status: subscription.statusId,
            amount: subscription.price || (subscription.periodId === 'monthly' ? plan.monthlyPrice : plan.annualPrice),
            currency: plan.currencyCode || 'BRL',
            period: subscription.periodId,
            paymentMethod: subscription.paymentMethodId,
            invoiceId: subscription.paymentGatewayId || subscription.id
        }];

        return (
            {
                activePlan,
                nextBilling,
                invoiceHistoryArray
            }
            );
    }
}

// -- VARIABLES

export const getActivePlanDetailsUseCase =
    new GetActivePlanDetailsUseCase(); 