// -- IMPORTS

import { documentType } from '../model/profile';
import { subscriptionPeriod, subscriptionType, subscriptionStatus } from '../model/subscription';
import { createChurchUseCase } from '../use_case/create_church_use_case';
import { createProfileUseCase } from '../use_case/create_profile_use_case';
import { createSubscriptionUseCase } from '../use_case/create_subscription_use_case';
import { Controller } from './controller';

// -- TYPES

export class ChurchController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { body } = request;

        let church = await createChurchUseCase.execute( body.churchInfo );

        let profile = await createProfileUseCase.execute(
            {
                ...body.adminInfo,
                churchId: church.id,
                documentType: documentType.cpf,
                roleSlug: 'administrator'
            }
            );
        let startAtDate = new Date();
        let expiresAtDate = new Date();

        if ( body.isAnnual )
        {
            expiresAtDate.setFullYear( expiresAtDate.getFullYear() + 1 );
        }
        else
        {
            expiresAtDate.setMonth( expiresAtDate.getMonth() + 1 );
        }
        let subscription = await createSubscriptionUseCase.execute(
            {
                churchId: church.id,
                planId: body.selectedPlan,
                typeId : subscriptionType.trial,
                statusId: subscriptionStatus.pending,
                periodId : body.isAnnual ? subscriptionPeriod.annual : subscriptionPeriod.monthly,
                startAtDateTimestamp: startAtDate,
                expiresAtDateTimestamp: expiresAtDate
            }
            );

        return (
            {
                subscriptionId: subscription.id
            }
            );
    }
}
