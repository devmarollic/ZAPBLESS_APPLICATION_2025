// -- IMPORTS

import { createClient } from '@supabase/supabase-js';
import { createLogger } from '../../utils/logger.js';
import { environment } from '../environment.js';

// -- VARIABLES

const logger = createLogger( 'AUTH_CONFIG' );
let supabaseClient = null;

// -- FUNCTIONS

function initializeSupabase()
{
    try
    {
        if ( !environment.SUPABASE_URL || !environment.SUPABASE_SERVICE_ROLE_KEY )
        {
            logger.warn( 'Supabase configuration missing, using default values' );
        }
        
        supabaseClient = createClient(
            environment.SUPABASE_URL,
            environment.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                    detectSessionInUrl: false
                }
            }
        );
        
        logger.info( 'Supabase client initialized successfully' );
        
        return supabaseClient;
    }
    catch ( error )
    {
        logger.logError( error, 'Failed to initialize Supabase client' );
        throw error;
    }
}

function getSupabaseClient()
{
    if ( !supabaseClient )
    {
        supabaseClient = initializeSupabase();
    }
    
    return supabaseClient;
}

// Create a separate client for user authentication (uses anon key)
function getSupabaseAuthClient()
{
    try
    {
        return createClient(
            environment.SUPABASE_URL,
            environment.SUPABASE_ANON_KEY,
            {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: false
                }
            }
        );
    }
    catch ( error )
    {
        logger.logError( error, 'Failed to initialize Supabase auth client' );
        throw error;
    }
}

// -- STATEMENTS

// Initialize on module load
initializeSupabase();

export { 
    getSupabaseClient,
    getSupabaseAuthClient,
    initializeSupabase
}; 