DO $$ DECLARE
    r RECORD;
BEGIN
    -- Disable trigger to avoid issues with foreign keys
    EXECUTE 'SET session_replication_role = replica';
    
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Enable triggers again
    EXECUTE 'SET session_replication_role = DEFAULT';
END $$;