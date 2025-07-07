// -- IMPORTS

import { object, z } from 'zod';
import { countryCodeEnum } from './country_code';
import { churchStatusEnum } from './church_status';
import { documentTypeEnum } from './document_type';

// -- CONSTANTS

export const churchSchema = z.object(
    {
        name: z.string(),
        statusId: churchStatusEnum.optional(),
        addressLine1: z.string(),
        addressLine2: z.string(),
        cityCode : z.string(),
        cityName: z.string(),
        countryCode : countryCodeEnum,
        languageTag: z.string(),
        imagePath: z.string().optional().nullable(),
        documentType: documentTypeEnum,
        documentNumber: z.string(),
        stateCode: z.string(),
        stateName: z.string().optional(),
        zipCode: z.string(),
        neighborhood: z.string()
    }
    );

export const churchWithIdSchema = z.object(
    {
        id : z.string().uuid()
    }
    )
    .merge( churchSchema );

export const updateChurchSchema = z.object(
    {
        name: z.string().optional(),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        zipCode: z.string().optional(),
        neighborhood: z.string().optional(),
        cityCode: z.string().optional(),
        stateCode: z.string().optional(),
        countryCode: countryCodeEnum.optional()
    }
    )
    .refine( 
        ( data ) => Object.keys( data ).length > 0, 
        { message: "At least one field must be provided for update" }
    );

export const churchType =
    {
        active: 'active',
        inactive: 'inactive',
        suspended: 'suspended'
    };