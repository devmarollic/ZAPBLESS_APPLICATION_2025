// -- IMPORTS

import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { getSubscriptionOverviewUseCase } from '../use_case/get_subscription_overview_use_case';
import { Controller } from './controller';

// -- TYPES

export class GetSubscriptionOverviewController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let { page = 1, limit = 10 } = request.query;
        let churchId = profileLogged.user_metadata.church_id;
        
        let subscriptionOverview = await getSubscriptionOverviewUseCase.execute(
            { 
                churchId,
                page: parseInt( page ), 
                limit: parseInt( limit )
            }
            );

        return subscriptionOverview;
    }
} 