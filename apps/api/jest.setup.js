// Jest setup file for API tests
require('dotenv').config({ path: '.env.test' });

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Use random port for tests
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.OPENAI_API_KEY = 'test-openai-key';

// Global test timeout
jest.setTimeout(30000);

// Mock external services by default
jest.mock('@supabase/supabase-js');
jest.mock('openai');

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});