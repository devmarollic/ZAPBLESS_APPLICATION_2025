import dotenv from 'dotenv';

let isDevelopment = process.env.NODE_ENV === 'development';

if ( isDevelopment )
{
    dotenv.config();
}

export const PORT = process.env.PORT;
export const SESSION_ID = process.env.SESSION_ID;
export const SESSION_DIR = process.env.SESSION_DIR;
export const SESSION_BASE_DIR = process.env.SESSION_BASE_DIR;
export const DEBUG = process.env.DEBUG;
export const RABBITMQ_URL = process.env.RABBITMQ_URL;
export const RABBITMQ_OUTBOUND_QUEUE = process.env.RABBITMQ_OUTBOUND_QUEUE;
export const RABBITMQ_INBOUND_QUEUE = process.env.RABBITMQ_INBOUND_QUEUE;
export const RABBITMQ_DISCONNECTED_SESSIONS_QUEUE = process.env.RABBITMQ_DISCONNECTED_SESSIONS_QUEUE;
export const CHURCH_ID = process.env.CHURCH_ID;
export const SUPABASE_DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
export const SUPABASE_DATABASE_KEY = process.env.SUPABASE_DATABASE_KEY;
export const SUPABASE_STORAGE_URL = process.env.SUPABASE_STORAGE_URL;

if ( !PORT ) throw new Error('PORT is not set');

if ( !SESSION_ID ) throw new Error('SESSION_ID is not set');

if ( !SESSION_DIR ) throw new Error('SESSION_DIR is not set');

if ( !DEBUG ) throw new Error('DEBUG is not set');

if ( !RABBITMQ_URL ) throw new Error('RABBITMQ_URL is not set');

if ( !RABBITMQ_OUTBOUND_QUEUE ) throw new Error('RABBITMQ_OUTBOUND_QUEUE is not set');

if ( !RABBITMQ_INBOUND_QUEUE ) throw new Error('RABBITMQ_INBOUND_QUEUE is not set');

if ( !RABBITMQ_DISCONNECTED_SESSIONS_QUEUE ) throw new Error('RABBITMQ_DISCONNECTED_SESSIONS_QUEUE is not set');

if ( !CHURCH_ID ) throw new Error('CHURCH_ID is not set');

if ( !SUPABASE_DATABASE_URL ) throw new Error('SUPABASE_DATABASE_URL is not set');

if ( !SUPABASE_DATABASE_KEY ) throw new Error('SUPABASE_DATABASE_KEY is not set');

if ( !SUPABASE_STORAGE_URL ) throw new Error('SUPABASE_STORAGE_URL is not set');