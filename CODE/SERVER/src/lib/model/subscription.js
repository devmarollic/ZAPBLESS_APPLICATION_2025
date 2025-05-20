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
        periodId : z.enum( [ 'monthly', 'annual' ] ),
        startAtDateTimestamp: z.string().date(),
        expiresAtDateTimestamp: z.string().date()
    }
    );

export const subscriptionWithIdSchema = z.object(
    {
        id : z.string()
    }
    )
    .merge( subscriptionSchema );