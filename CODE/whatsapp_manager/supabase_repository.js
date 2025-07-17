// -- IMPORTS

import { createClient } from '@supabase/supabase-js';
import { Repository } from './Repository.js';
import { supabaseService } from './supabase_service.js';
import { isArray } from './utils.js';

// -- TYPES

export class SupabaseRepository extends Repository
{
    // -- INQUIRIES

    async query(
        table,
        filters,
        options = {}
        )
    {
        let query = supabaseService
            .getClient()
            .from( table )
            .select();

        query = this.buildFilter( query, filters );

        if ( options.order )
        {
            query = query.order( options.order.column, { ascending: options.order.ascending } );
        }

        if ( options.limit !== undefined )
        {
            query = query.limit( options.limit );
        }

        if ( options.offset !== undefined )
        {
            query = query.range( options.offset, ( options.offset + ( options.limit ?? 0) ) - 1 );
        }

        let { data, error } = await query;

        this.handleError( error );

        return data;
    }

    // -- OPERATIONS

    async insert(
        table,
        data
        )
    {
        let { data: row, error } = await supabaseService
            .getClient()
            .from( table )
            .insert( data )
            .select()
            .single();

        this.handleError( error );

        return row;
    }

    // ~~

    async upsert(
        table,
        data,
        conflictTarget
        )
    {
        let target = conflictTarget.join( ',' );
        let { data: row, error } = await supabaseService
            .getClient()
            .from( table )
            .upsert( data, { onConflict: target } )
            .select()
            .single();

        this.handleError( error );

        return row;
    }
    
    // ~~

    async update(
        table,
        idCol,
        id,
        data
        )
    {
        let { data: row, error } = await supabaseService
            .getClient()
            .from( table )
            .update( data )
            .eq( idCol, id )
            .select()
            .single();

        this.handleError( error );

        return row;
    }

    // ~~

    async remove(
        table,
        filters
        )
    {
        let query = supabaseService
            .getClient()
            .from( table );
        query = this.buildFilter( query, filters );
        let { error } = await query;

        this.handleError( error );
    }

    // ~~~

    buildFilter(
        query,
        filters
        )
    {
        if ( !filters ) return query;

        let filterArray = Object.entries( filters );
        
        for ( let [ field, value ] of filterArray )
        {
            if ( isArray( value ) )
            {
                query = query.in( field, value );
            }
            else
            {
                query = query.eq( field, value );
            }
        }

        return query;
    }

    // ~~

    handleError(
        error
        )
    {
        if ( error !== null ) throw error;
    }
}
