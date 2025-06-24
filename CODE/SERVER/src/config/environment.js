// -- IMPORTS

import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// -- CONSTANTS

dotenv.config(
    {
        path: path.resolve( process.cwd(), '.env' )
    }
);

// -- TYPES

const environmentSchema = z.object(
    {
        NODE_ENV: z.enum( ['development', 'production', 'test'] ).default( 'development' ),
        PORT: z.string().transform( Number ).default( 3000 ),
        HOST: z.string().default( '0.0.0.0' ),
        
        // Database
        SUPABASE_URL: z.string().url().optional().default( 'https://example.supabase.co' ),
        SUPABASE_ANON_KEY: z.string().optional().default( 'example_anon_key' ),
        SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default( 'example_service_key' ),
        
        // WhatsApp
        EVOLUTION_API_URL: z.string().url().optional(),
        
        // Email
        SMTP_HOST: z.string().default( 'localhost' ),
        SMTP_PORT: z.union( [z.string(), z.number()] ).transform( Number ).default( 1025 ),
        SMTP_USER: z.string().optional(),
        SMTP_PASSWORD: z.string().optional(),
        
        // Payment
        PAGARME_SECRET_KEY: z.string().optional().default( 'sk_test_example_key' ),
        PAGARME_PUBLIC_KEY: z.string().optional().default( 'pk_test_example_key' ),
        
        // Frontend
        FRONTEND_URL: z.string().url().default( 'http://localhost:5173' ),
        
        // Security
        JWT_SECRET: z.string().min( 32 ).optional().default( 'development_jwt_secret_32_chars_min' ),
        
        // RabbitMQ
        RABBITMQ_URL: z.string().url().optional()
    }
);

// -- VARIABLES

let environment;

// -- FUNCTIONS

function validateEnvironment()
{
    try 
    {
        environment = environmentSchema.parse( process.env );
        
        // Warning for production environment with default values
        if ( environment.NODE_ENV === 'production' )
        {
            const productionWarnings = [];
            
            if ( environment.SUPABASE_URL === 'https://example.supabase.co' )
            {
                productionWarnings.push( 'SUPABASE_URL' );
            }
            
            if ( environment.SUPABASE_ANON_KEY === 'example_anon_key' )
            {
                productionWarnings.push( 'SUPABASE_ANON_KEY' );
            }
            
            if ( environment.JWT_SECRET === 'development_jwt_secret_32_chars_min' )
            {
                productionWarnings.push( 'JWT_SECRET' );
            }
            
            if ( productionWarnings.length > 0 )
            {
                console.warn( '⚠️  WARNING: Using default values in production for:', productionWarnings.join( ', ' ) );
                console.warn( '⚠️  Please set proper environment variables for production!' );
            }
        }
        
        return environment;
    }
    catch ( error )
    {
        console.error( '❌ Environment validation failed:' );
        console.error( error.errors );
        console.error( '\n💡 Tip: Copy env.example to .env and fill in the required values' );
        
        process.exit( 1 );
    }
}

// -- STATEMENTS

environment = validateEnvironment();

export { environment }; 