// -- IMPORTS

import { z } from 'zod';

// -- CONSTANTS

const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR'
};

const HTTP_STATUS_CODES = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
    EXTERNAL_SERVICE_ERROR: 502
};

// -- TYPES

const errorDetailsSchema = z.object(
    {
        field: z.string().optional(),
        value: z.any().optional(),
        code: z.string().optional()
    }
);

// -- FUNCTIONS

class AppError extends Error
{
    constructor( message, code = ERROR_CODES.INTERNAL_ERROR, details = null )
    {
        super( message );
        
        this.name = 'AppError';
        this.code = code;
        this.statusCode = HTTP_STATUS_CODES[code] || 500;
        this.details = details;
        this.timestamp = new Date().toISOString();
        
        Error.captureStackTrace( this, AppError );
    }
    
    static validation( message, details = null )
    {
        return new AppError( message, ERROR_CODES.VALIDATION_ERROR, details );
    }
    
    static unauthorized( message = 'Unauthorized access' )
    {
        return new AppError( message, ERROR_CODES.UNAUTHORIZED );
    }
    
    static forbidden( message = 'Forbidden access' )
    {
        return new AppError( message, ERROR_CODES.FORBIDDEN );
    }
    
    static notFound( message = 'Resource not found' )
    {
        return new AppError( message, ERROR_CODES.NOT_FOUND );
    }
    
    static conflict( message = 'Resource conflict' )
    {
        return new AppError( message, ERROR_CODES.CONFLICT );
    }
    
    static internal( message = 'Internal server error' )
    {
        return new AppError( message, ERROR_CODES.INTERNAL_ERROR );
    }
    
    static externalService( message = 'External service error' )
    {
        return new AppError( message, ERROR_CODES.EXTERNAL_SERVICE_ERROR );
    }
    
    toJSON()
    {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            details: this.details,
            timestamp: this.timestamp
        };
    }
}

function handleZodError( zodError )
{
    const details = zodError.errors.map( error => ({
        field: error.path.join( '.' ),
        message: error.message,
        code: error.code
    }));
    
    return AppError.validation( 'Validation failed', details );
}

function handleDatabaseError( databaseError )
{
    if ( databaseError.code === '23505' )
    {
        return AppError.conflict( 'Resource already exists' );
    }
    
    if ( databaseError.code === '23503' )
    {
        return AppError.validation( 'Referenced resource does not exist' );
    }
    
    return AppError.internal( 'Database operation failed' );
}

// -- STATEMENTS

export {
    AppError,
    ERROR_CODES,
    HTTP_STATUS_CODES,
    handleZodError,
    handleDatabaseError
}; 