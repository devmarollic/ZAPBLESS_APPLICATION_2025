// -- IMPORTS

import { profileService } from '../service/profile_service';
import { subscriptionService } from '../service/subscription_service';
import { AppError } from '../errors/app_error';
import { subscriptionStatus, subscriptionType } from '../model/subscription';
import { isNullOrUndefined } from '../../base';
import { planService } from '../service/plan_service';
import { getRandomTuid } from 'senselogic-gist';

// -- TYPES

export class AddSubscriptionUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let plan = await planService.getPlanById( input.planId );

        if ( isNullOrUndefined( plan ) )
        {
            throw new AppError( 'plan-not-found', 404 );
        }

        let planPrice = input.billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
        let churchId = await profileService.getChurchIdByProfileEmail( input.email );
        let startAtDateTimestamp = new Date();
        let expiresAtDateTimestamp = startAtDateTimestamp;
        
        if ( input.billingPeriod === 'monthly' )
        {
            expiresAtDateTimestamp.setMonth( expiresAtDateTimestamp.getMonth() + 1 );
        }
        else
        {
            expiresAtDateTimestamp.setFullYear( expiresAtDateTimestamp.getFullYear() + 1 );
        }

        if ( !churchId )
        {
            throw new AppError( 'church-not-found', 404 );
        }

        let subscription = await subscriptionService.addSubscription(
            {
                id: getRandomTuid(),
                planId: plan.id,
                statusId: subscriptionStatus.pending,
                churchId: churchId,
                typeId: subscriptionType.trial,
                price: planPrice,
                periodId: input.billingPeriod,
                startAtDateTimestamp,
                expiresAtDateTimestamp
            }
            );

        return subscription;
    }
}

// -- VARIABLES

export let addSubscriptionUseCase =
    new AddSubscriptionUseCase();