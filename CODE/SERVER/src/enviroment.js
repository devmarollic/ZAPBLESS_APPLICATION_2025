// -- IMPORTS

import dotenv from 'dotenv';
import { logError } from 'senselogic-gist';
import { z } from 'zod';

// -- STATEMENTS

dotenv.config(
    {
        path: '.env'
    }
    );

// -- CONSTANTS

const enviromentSchema = z.object(
    {
        ZAPBLESS_PROJECT_SUPABASE_DATABASE_HOST: z.string(),
        ZAPBLESS_PROJECT_SUPABASE_DATABASE_PASSWORD: z.string(),
        ZAPBLESS_PROJECT_SUPABASE_DATABASE_URL: z.string(),
        ZAPBLESS_PROJECT_SUPABASE_DATABASE_KEY: z.string(),
        ZAPBLESS_PROJECT_SUPABASE_STORAGE_URL: z.string(),
        ZAPBLESS_PROJECT_SUPABASE_JWT_SECRET: z.string(),
        ZAPBLES_PROJECT_PAGARME_API_KEY: z.string(),
        ZAPBLES_PROJECT_PAGARME_ACCOUNT_ID: z.string(),
        ZAPBLESS_PROJECT_MONGODB_URL: z.string(),
        FRONTEND_URL: z.string(),
        BASE_URL: z.string(),
        PAGARME_API_KEY: z.string(),
        PAGARME_BASE_URL: z.string(),
        PORT: z.coerce.number(),
        NODE_ENV: z.enum( [ 'development', 'production', 'test' ] )
    }
    );

// ~~

const { success, error, data } = enviromentSchema.safeParse( process.env );

if ( !success )
{
    logError( error );
    process.exit( 1 );
}

export const enviroment = data;