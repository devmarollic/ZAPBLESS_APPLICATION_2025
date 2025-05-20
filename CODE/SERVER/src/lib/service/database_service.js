// -- IMPORTS

import { supabaseService } from './supabase_service';

// -- CONSTANTS

export let
    databaseName = 'public';

// -- TYPES

class DatabaseService
{
    // -- INQUIRIES

    getClient(
        )
    {
        return supabaseService.getClient();
    }
}

// -- VARIABLES

export let databaseService
    = new DatabaseService();
