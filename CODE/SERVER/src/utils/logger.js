// -- IMPORTS

import { environment } from '../config/environment.js';

// -- CONSTANTS

const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
};

const LOG_COLORS = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[36m',
    debug: '\x1b[35m',
    reset: '\x1b[0m'
};

// -- FUNCTIONS

class Logger
{
    constructor( context = 'APP' )
    {
        this.context = context;
        this.isDevelopment = environment.NODE_ENV === 'development';
    }
    
    formatMessage( level, message, data = null )
    {
        const timestamp = new Date().toISOString();
        const contextString = `[${this.context}]`;
        const levelString = `[${level.toUpperCase()}]`;
        
        let formattedMessage = `${timestamp} ${contextString} ${levelString} ${message}`;
        
        if ( data )
        {
            formattedMessage += ` ${JSON.stringify( data, null, 2 )}`;
        }
        
        return formattedMessage;
    }
    
    colorize( level, message )
    {
        if ( !this.isDevelopment )
        {
            return message;
        }
        
        const color = LOG_COLORS[level] || LOG_COLORS.reset;
        
        return `${color}${message}${LOG_COLORS.reset}`;
    }
    
    log( level, message, data = null )
    {
        const formattedMessage = this.formatMessage( level, message, data );
        const colorizedMessage = this.colorize( level, formattedMessage );
        
        switch ( level )
        {
            case LOG_LEVELS.ERROR:
                console.error( colorizedMessage );
                break;
            case LOG_LEVELS.WARN:
                console.warn( colorizedMessage );
                break;
            case LOG_LEVELS.INFO:
                console.info( colorizedMessage );
                break;
            case LOG_LEVELS.DEBUG:
                if ( this.isDevelopment )
                {
                    console.debug( colorizedMessage );
                }
                break;
            default:
                console.log( colorizedMessage );
        }
    }
    
    error( message, data = null )
    {
        this.log( LOG_LEVELS.ERROR, message, data );
    }
    
    warn( message, data = null )
    {
        this.log( LOG_LEVELS.WARN, message, data );
    }
    
    info( message, data = null )
    {
        this.log( LOG_LEVELS.INFO, message, data );
    }
    
    debug( message, data = null )
    {
        this.log( LOG_LEVELS.DEBUG, message, data );
    }
    
    logError( error, context = 'Unknown' )
    {
        const errorData = {
            name: error.name,
            message: error.message,
            stack: error.stack,
            context: context
        };
        
        if ( error.details )
        {
            errorData.details = error.details;
        }
        
        this.error( `Error in ${context}`, errorData );
    }
    
    logRequest( request, response, duration )
    {
        const requestData = {
            method: request.method,
            url: request.url,
            userAgent: request.headers['user-agent'],
            ip: request.ip,
            statusCode: response.statusCode,
            duration: `${duration}ms`
        };
        
        this.info( 'Request processed', requestData );
    }
}

function createLogger( context )
{
    return new Logger( context );
}

// -- STATEMENTS

const defaultLogger = new Logger();

export {
    Logger,
    createLogger,
    defaultLogger,
    LOG_LEVELS
}; 