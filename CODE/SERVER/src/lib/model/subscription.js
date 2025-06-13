// -- IMPORTS

import { object, z } from 'zod';
import { profileStatusEnum } from './profile_status';
import { profileGenderEnum } from './profile_gender';
import { countryCodeEnum } from './country_code';

// -- CONSTANTS

export const subscriptionSchema = z.object(
    {       
        churchId: z.string(),
        planId: z.enum( [ 'basic', 'growth', 'community' ] ),
        typeId : z.enum( [ 'active', 'inactive', 'trial', 'cancelled' ] ).optional(),
        statusId: z.enum( [ 'paid', 'pending', 'canceled', 'refused' ] ).optional(),
        periodId : z.enum( [ 'monthly', 'annual' ] ),
        startAtDateTimestamp: z.date(),
        expiresAtDateTimestamp: z.date()
    }
    );

export const subscriptionWithIdSchema = z.object(
    {
        id : z.string()
    }
    )
    .merge( subscriptionSchema );

export const subscriptionType =
    {
        active: 'active',
        inactive: 'inactive',
        trial: 'trial',
        cancelled: 'cancelled'
    };

export const subscriptionPeriod =
    {
        monthly: 'monthly',
        annual: 'annual'
    };

export const subscriptionStatus =
    {
        paid: 'paid',
        pending: 'pending',
        canceled: 'canceled',
        refused: 'refused'
    };
