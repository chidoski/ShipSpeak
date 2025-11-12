/**
 * ShipSpeak Database Package
 * Exports database types, client, and utilities
 */

// Export types
export * from './types';

// Export Supabase client and utilities
export * from './supabase';

// Export migration utilities
export { migrateUp, migrateDown, migrationStatus } from './migrate';