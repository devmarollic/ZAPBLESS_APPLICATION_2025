// -- IMPORTS

import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { getBillingHistoryUseCase } from '../use_case/get_billing_history_use_case';
import { Controller } from './controller';

// -- TYPES

export class GetBillingHistoryController extends Controller
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
        let churchId = profileLogged.user_metadata.church_id
        
        let billingHistory = await getBillingHistoryUseCase.execute(
            { 
                churchId, 
                page: parseInt( page ), 
                limit: parseInt( limit ) 
            }
            );

        return billingHistory;
    }
} 