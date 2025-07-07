// -- IMPORTS

import { getMapByCode, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { PagarmeService } from './pagarme_service';
import { applyPagination } from '../../base';

// -- FUNCTIONS

class SubscriptionService extends PagarmeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        super();
    }

    // -- INQUIRIES

    async getSubscriptionByChurchId(
        churchId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .select()
                .eq( 'churchId', churchId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getSubscriptionById(
        subscriptionId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .select()
                .eq( 'id', subscriptionId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getSubscriptionByEmail(
        email
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .select( `
                    id,
                    churchId,
                    planId,
                    typeId,
                    statusId,
                    periodId,
                    startAtDateTimestamp,
                    expiresAtDateTimestamp,
                    church:CHURCH!inner (
                        profile:PROFILE!constraint_profile_church_1 (
                            email
                        )
                    )
                ` )
                .eq( 'church.profile.email', email )
                .eq( 'statusId', 'pending' )
                .limit( 1 )
                .maybeSingle();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getSubscriptionWithDetailsById(
        subscriptionId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .select( `
                    id,
                    churchId,
                    planId,
                    typeId,
                    statusId,
                    periodId,
                    startAtDateTimestamp,
                    expiresAtDateTimestamp,
                    paymentGatewayId,
                    paymentMethodId,
                    church:CHURCH!inner (
                        id,
                        name,
                        countryCode,
                        documentNumber,
                        documentType,
                        addressLine1,
                        addressLine2,
                        cityName,
                        stateCode,
                        zipCode,
                        profile:PROFILE!constraint_profile_church_1 (
                            id,
                            firstName,
                            lastName,
                            email,
                            phoneNumber
                        )
                    ),
                    plan:PLAN!inner (
                        id,
                        name,
                        description,
                        monthlyPrice,
                        annualPrice,
                        currencyCode
                    )
                ` )
                .eq( 'id', subscriptionId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getSubscriptionArrayByChurchId(
        churchId,
        page,
        limit
        )
    {
        let { startIndex, endIndex } = applyPagination( page, limit );

        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .select()
                .eq( 'churchId', churchId )
                .order( 'creationTimestamp', { ascending: false } )
                .range( startIndex, endIndex );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getSubscriptionHistoryByChurchId(
        churchId,
        page,
        limit
        )
    {
        let { startIndex, endIndex } = applyPagination( page, limit );

        let { data, error, count } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .select( `
                    id,
                    planId,
                    typeId,
                    statusId,
                    periodId,
                    price,
                    startAtDateTimestamp,
                    expiresAtDateTimestamp,
                    paymentGatewayId,
                    paymentMethodId,
                    plan:PLAN!inner (
                        id,
                        name,
                        description,
                        monthlyPrice,
                        annualPrice,
                        currencyCode
                    )
                `, { count: 'exact' } )
                .eq( 'churchId', churchId )
                .order( 'startAtDateTimestamp', { ascending: false } )
                .range( startIndex, endIndex );

        if ( error !== null )
        {
            logError( error );
        }

        return {
            data: data || [],
            count: count || 0
        };
    }

    // -- OPERATIONS

    async addSubscription(
        subscription
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .insert( subscription )
                .select()
                .single();


        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setSubscriptionByChurchId(
        subscription,
        churchId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .update( subscription )
                .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setSubscriptionById(
        subscription,
        id
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .update( subscription )
                .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    async setSubscriptionByPaymentGatewayId(
        subscription,
        paymentGatewayId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .update( subscription )
                .eq( 'paymentGatewayId', paymentGatewayId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeSubscriptionByChurchId(
        churchId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .delete()
                .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let subscriptionService
    = new SubscriptionService();
