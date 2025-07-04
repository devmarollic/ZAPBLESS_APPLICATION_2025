// -- IMPORTS

import { z } from 'zod';
import { logError } from 'senselogic-gist';

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
        NODE_ENV: z.enum( [ 'development', 'production', 'test' ] ),
        ABACATE_PAY_API_KEY: z.string(),
        ABACATE_PAY_BASE_URL: z.string(),
        GOOGLE_OAUTH_URL_CALLBACK: z.string()
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