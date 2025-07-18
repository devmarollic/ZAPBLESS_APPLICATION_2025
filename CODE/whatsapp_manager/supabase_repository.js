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

        query = this.buildAdvancedFilter( query, filters );

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
        filters,
        data
        )
    {
        let query = supabaseService
            .getClient()
            .from( table )
            .update( data );

        if ( filters )
        {
            query = this.buildAdvancedFilter( query, filters );
        }

        let { data: row, error, count } = await query.select( '*', { count: 'exact' } ).single();

        this.handleError( error );

        return (
            {
                data: row,
                count
            }
            );
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
        query = this.buildAdvancedFilter( query, filters );
        let { error } = await query;

        this.handleError( error );
    }

    // ~~~

    async count(
        table,
        filters
        )
    {
        let query = supabaseService.getClient()
        .from( table )
        .select( '*', { count: 'exact' } );

        if ( filters )
        {
            query = this.buildAdvancedFilter( query, filters );
        }

        let { count, error } = await query;

        this.handleError( error );

        return count;
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

    buildAdvancedFilter(
        query,
        filters
        )
    {
        if ( !filters ) return query;

        if ( filters.where )
        {
            return this.buildWhereClause( query, filters.where );
        }

        return this.buildFilter( query, filters );
    }

    // ~~

    buildWhereClause(
        query,
        whereClause
        )
    {
        if ( whereClause.AND )
        {
            return this.buildAndClause( query, whereClause.AND );
        }

        if ( whereClause.OR )
        {
            return this.buildOrClause( query, whereClause.OR );
        }

        return this.buildSimpleCondition( query, whereClause );
    }

    // ~~

    buildAndClause(
        query,
        andConditions
        )
    {
        for ( let condition of andConditions )
        {
            query = this.buildWhereClause( query, condition );
        }

        return query;
    }

    // ~~

    buildOrClause(
        query,
        orConditions
        )
    {
        let orFilters = [];

        for ( let condition of orConditions )
        {
            let fieldName = this.extractFieldName( condition );
            let operator = this.extractOperator( condition );
            let value = this.extractValue( condition );

            let filter = this.buildFilterCondition( fieldName, operator, value );
            orFilters.push( filter );
        }

        if ( orFilters.length > 0 )
        {
            return query.or( orFilters.join( ',' ) );
        }

        return query;
    }

    // ~~

    buildConditionExpression(
        condition
        )
    {
        let fieldName = this.extractFieldName( condition );
        let operator = this.extractOperator( condition );
        let value = this.extractValue( condition );

        return this.buildFilterCondition( fieldName, operator, value );
    }

    // ~~

    buildFilterCondition(
        fieldName,
        operator,
        value
        )
    {
        switch ( operator )
        {
            case 'equals':
                return `${ fieldName }.eq.${ this.formatValue( value ) }`;
            case 'lte':
                return `${ fieldName }.lte.${ this.formatValue( value ) }`;
            case 'gte':
                return `${ fieldName }.gte.${ this.formatValue( value ) }`;
            case 'lt':
                return `${ fieldName }.lt.${ this.formatValue( value ) }`;
            case 'gt':
                return `${ fieldName }.gt.${ this.formatValue( value ) }`;
            case 'neq':
                return `${ fieldName }.neq.${ this.formatValue( value ) }`;
            case 'in':
                return `${ fieldName }.in.(${ this.formatArrayValue( value ) })`;
            case 'is':
                return `${ fieldName }.is.${ this.formatValue( value ) }`;
            default:
                return `${ fieldName }.eq.${ this.formatValue( value ) }`;
        }
    }

    // ~~

    buildSimpleCondition(
        query,
        condition
        )
    {
        let fieldName = this.extractFieldName( condition );
        let operator = this.extractOperator( condition );
        let value = this.extractValue( condition );

        switch ( operator )
        {
            case 'equals':
                return query.eq( fieldName, value );
            case 'lte':
                return query.lte( fieldName, value );
            case 'gte':
                return query.gte( fieldName, value );
            case 'lt':
                return query.lt( fieldName, value );
            case 'gt':
                return query.gt( fieldName, value );
            case 'neq':
                return query.neq( fieldName, value );
            case 'in':
                return query.in( fieldName, value );
            case 'is':
                return query.is( fieldName, value );
            default:
                return query.eq( fieldName, value );
        }
    }

    // ~~

    extractFieldName(
        condition
        )
    {
        if ( condition.key && condition.key.path )
        {
            return condition.key.path.join( '.' );
        }

        let keys = Object.keys( condition );
        for ( let key of keys )
        {
            if ( key !== 'AND' && key !== 'OR' )
            {
                return key;
            }
        }

        return Object.keys( condition )[ 0 ];
    }

    // ~~

    extractOperator(
        condition
        )
    {
        if ( condition.key && condition.key.path )
        {
            let keys = Object.keys( condition );
            for ( let key of keys )
            {
                if ( key !== 'key' )
                {
                    return key;
                }
            }
            return 'equals';
        }

        let fieldName = this.extractFieldName( condition );
        let fieldCondition = condition[ fieldName ];

        if ( typeof fieldCondition === 'object' && fieldCondition !== null )
        {
            let operatorKeys = Object.keys( fieldCondition );
            if ( operatorKeys.length > 0 )
            {
                return operatorKeys[ 0 ];
            }
        }

        return 'equals';
    }

    // ~~

    extractValue(
        condition
        )
    {
        if ( condition.key && condition.key.path )
        {
            let operator = this.extractOperator( condition );
            return condition[ operator ];
        }

        let fieldName = this.extractFieldName( condition );
        let fieldCondition = condition[ fieldName ];

        if ( typeof fieldCondition === 'object' && fieldCondition !== null )
        {
            let operator = this.extractOperator( condition );
            return fieldCondition[ operator ];
        }

        return fieldCondition;
    }

    // ~~

    formatValue(
        value
        )
    {
        if ( value === null )
        {
            return 'null';
        }

        if ( typeof value === 'string' )
        {
            return `"${ value }"`;
        }

        return value.toString();
    }

    // ~~

    formatArrayValue(
        value
        )
    {
        if ( !isArray( value ) )
        {
            return this.formatValue( value );
        }

        return value.map( item => this.formatValue( item ) ).join( ',' );
    }

    // ~~

    handleError(
        error
        )
    {
        if ( error !== null ) throw error;
    }
}
