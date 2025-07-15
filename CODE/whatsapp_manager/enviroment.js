// const dotenv = require('dotenv');

// dotenv.config();

const PORT = process.env.PORT || 8080;
const SESSION_ID = process.env.SESSION_ID || `session-123`;
const SESSION_DIR = process.env.SESSION_DIR || './data';
const DEBUG = process.env.DEBUG === 'true';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://zapbless:zapbless@k8s-dev-sat.zapbless.com.br';
const RABBITMQ_OUTBOUND_QUEUE = process.env.RABBITMQ_OUTBOUND_QUEUE || 'zapbless.outbound';
const RABBITMQ_INBOUND_QUEUE = process.env.RABBITMQ_INBOUND_QUEUE || 'zapbless.inbound';
const RABBITMQ_DISCONNECTED_SESSIONS_QUEUE = process.env.RABBITMQ_DISCONNECTED_SESSIONS_QUEUE || 'zapbless.disconnected.sessions';
const CHURCH_ID = process.env.CHURCH_ID;
const SUPABASE_DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
const SUPABASE_DATABASE_KEY = process.env.SUPABASE_DATABASE_KEY;
const SUPABASE_STORAGE_URL = process.env.SUPABASE_STORAGE_URL;

module.exports = {
    PORT,
    SESSION_ID,
    SESSION_DIR,
    DEBUG,
    RABBITMQ_URL,
    RABBITMQ_OUTBOUND_QUEUE,
    RABBITMQ_INBOUND_QUEUE,
    RABBITMQ_DISCONNECTED_SESSIONS_QUEUE,
    CHURCH_ID,
    SUPABASE_DATABASE_URL,
    SUPABASE_DATABASE_KEY,
    SUPABASE_STORAGE_URL
}