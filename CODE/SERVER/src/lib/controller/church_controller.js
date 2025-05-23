// -- IMPORTS

import { pagarmeService } from '../service/pagarme_service';
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
                churchId: church.id
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
                typeId : 'inactive',
                periodId : body.isAnnual ? 'annual' : 'monthly',
                startAtDateTimestamp: startAtDate,
                expiresAtDateTimestamp: expiresAtDate
            }
            );
        // let pagarmeClient = await pagarmeService.getClient();

        // let customer = await pagarmeClient.customers.create(
        //     {
        //         external_id: church.id,
        //         name: church.name,
        //         type: 'company',
        //         country: church.countryCode,
        //         email: profile.email,
        //         documents:
        //             [
        //                 {
        //                     type: 'cpf',
        //                     number: '31142815080'
        //                 }
        //             ],
        //         phone_numbers: [ profile.phoneNumber ]
        //     }
        //     );
        // console.log( { customer } );
        // -- add plan selectedPlan, isAnnual

        return church;
    }
}
