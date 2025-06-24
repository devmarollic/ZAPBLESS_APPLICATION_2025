// -- IMPORTS

import { vi } from 'vitest';

// -- CONSTANTS

const MOCK_ENVIRONMENT = {
    NODE_ENV: 'test',
    PORT: 3000,
    HOST: '0.0.0.0',
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test_anon_key',
    SUPABASE_SERVICE_ROLE_KEY: 'test_service_key',
    PAGARME_SECRET_KEY: 'sk_test_mock_key',
    PAGARME_PUBLIC_KEY: 'pk_test_mock_key',
    FRONTEND_URL: 'http://localhost:5173',
    JWT_SECRET: 'test_jwt_secret_32_characters_long',
    SMTP_HOST: 'localhost',
    SMTP_PORT: 1025
};

// -- FUNCTIONS

function setupEnvironmentMocks()
{
    vi.mock( '../config/environment.js', () => ({
        environment: MOCK_ENVIRONMENT
    }));
}

function setupConsoleMocks()
{
    // Mock console methods to reduce noise in tests
    global.console = {
        ...console,
        log: vi.fn(),
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    };
}

function setupFetchMock()
{
    global.fetch = vi.fn();
}

function setupTimerMocks()
{
    vi.useFakeTimers();
}

// -- STATEMENTS

// Setup all mocks
setupEnvironmentMocks();
setupConsoleMocks();
setupFetchMock();

// Export utilities for tests
export {
    MOCK_ENVIRONMENT,
    setupTimerMocks
}; 