// -- IMPORTS

import { object, z } from 'zod';
import { profileStatusEnum } from './profile_status';
import { profileGenderEnum } from './profile_gender';
import { countryCodeEnum } from './country_code';
import { documentTypeEnum } from './document_type';

// -- CONSTANTS

export const profileSchema = z.object(
    {
        churchId : z.string(),
        statusId : profileStatusEnum.optional(),
        firstName: z.string(),
        lastName: z.string(),
        birthDate: z.coerce.date().optional(),
        genderId : profileGenderEnum,
        email: z.string().email(),
        password: z.string().optional(),
        phonePrefix: z.string(),
        phoneNumber: z.string(),
        countryCode: countryCodeEnum,
        imagePath: z.string().optional().nullable(),
        documentType: documentTypeEnum,
        documentNumber: z.string().optional().nullable(),
        aboutDescription: z.string().optional(),
        legalName: z.string().optional()
    }
    )
    .transform(
        ( data ) =>
        {
            let legalName = [ data.firstName, data.lastName ]
                .filter( Boolean )
                .join( ' ' );

            return (
                {
                    ...data,
                    legalName
                }
                );
        }
        );

export const profileWithIdSchema = z.object(
    {
        id : z.string().uuid()
    }
    )
    .merge( profileSchema );

export const documentType =
    {
        cpf: 'cpf',
        cnpj: 'cnpj',
        passport: 'passport'
    };

export const profileStatus =
    {
        active: 'active',
        inactive: 'inactive'
    };