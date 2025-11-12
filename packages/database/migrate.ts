/**
 * Database Migration Runner for ShipSpeak
 * Handles up/down migrations with proper error handling and rollback
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

// Admin client for migrations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

interface Migration {
  version: string;
  name: string;
  upPath: string;
  downPath: string;
}

interface MigrationRecord {
  version: string;
  name: string;
  applied_at: string;
  applied_by: string;
}

/**
 * Create migration tracking table if it doesn't exist
 */
async function createMigrationTable(): Promise<void> {
  const { error } = await supabaseAdmin.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW(),
        applied_by TEXT DEFAULT 'system'
      );
      
      CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at 
      ON schema_migrations(applied_at);
    `
  });

  if (error) {
    throw new Error(`Failed to create migration table: ${error.message}`);
  }
}

/**
 * Get all available migrations from the migrations directory
 */
function getAvailableMigrations(): Migration[] {
  const migrationsDir = join(__dirname, 'migrations');
  const files = readdirSync(migrationsDir);
  
  const upFiles = files.filter(f => f.endsWith('.up.sql'));
  const migrations: Migration[] = [];

  for (const upFile of upFiles) {
    const version = basename(upFile, '.up.sql');
    const downFile = `${version}.down.sql`;
    
    if (files.includes(downFile)) {
      migrations.push({
        version,
        name: version.replace(/^\d+_/, '').replace(/_/g, ' '),
        upPath: join(migrationsDir, upFile),
        downPath: join(migrationsDir, downFile)
      });
    }
  }

  return migrations.sort((a, b) => a.version.localeCompare(b.version));
}

/**
 * Get applied migrations from database
 */
async function getAppliedMigrations(): Promise<MigrationRecord[]> {
  await createMigrationTable();
  
  const { data, error } = await supabaseAdmin
    .from('schema_migrations')
    .select('*')
    .order('version');

  if (error) {
    throw new Error(`Failed to fetch applied migrations: ${error.message}`);
  }

  return data || [];
}

/**
 * Execute a migration SQL file
 */
async function executeMigration(migrationPath: string): Promise<void> {
  const sql = readFileSync(migrationPath, 'utf-8');
  
  // Split SQL into statements and execute each one
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    const { error } = await supabaseAdmin.rpc('exec', {
      sql: statement + ';'
    });

    if (error) {
      throw new Error(`Failed to execute migration statement: ${error.message}\nStatement: ${statement}`);
    }
  }
}

/**
 * Record migration as applied
 */
async function recordMigration(migration: Migration): Promise<void> {
  const { error } = await supabaseAdmin
    .from('schema_migrations')
    .insert({
      version: migration.version,
      name: migration.name,
      applied_by: 'migration_runner'
    });

  if (error) {
    throw new Error(`Failed to record migration: ${error.message}`);
  }
}

/**
 * Remove migration record
 */
async function removeMigrationRecord(version: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('schema_migrations')
    .delete()
    .eq('version', version);

  if (error) {
    throw new Error(`Failed to remove migration record: ${error.message}`);
  }
}

/**
 * Run pending migrations
 */
export async function migrateUp(): Promise<void> {
  console.log('🔄 Running database migrations...');
  
  try {
    const availableMigrations = getAvailableMigrations();
    const appliedMigrations = await getAppliedMigrations();
    const appliedVersions = new Set(appliedMigrations.map(m => m.version));

    const pendingMigrations = availableMigrations.filter(
      m => !appliedVersions.has(m.version)
    );

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    for (const migration of pendingMigrations) {
      console.log(`📦 Applying migration: ${migration.name} (${migration.version})`);
      
      await executeMigration(migration.upPath);
      await recordMigration(migration);
      
      console.log(`✅ Applied migration: ${migration.name}`);
    }

    console.log(`🎉 Successfully applied ${pendingMigrations.length} migrations`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Rollback last migration
 */
export async function migrateDown(): Promise<void> {
  console.log('🔄 Rolling back last migration...');
  
  try {
    const appliedMigrations = await getAppliedMigrations();
    
    if (appliedMigrations.length === 0) {
      console.log('✅ No migrations to rollback');
      return;
    }

    const lastMigration = appliedMigrations[appliedMigrations.length - 1];
    const availableMigrations = getAvailableMigrations();
    const migration = availableMigrations.find(m => m.version === lastMigration.version);

    if (!migration) {
      throw new Error(`Migration file not found for version: ${lastMigration.version}`);
    }

    console.log(`📦 Rolling back migration: ${migration.name} (${migration.version})`);
    
    await executeMigration(migration.downPath);
    await removeMigrationRecord(migration.version);
    
    console.log(`✅ Rolled back migration: ${migration.name}`);
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

/**
 * Show migration status
 */
export async function migrationStatus(): Promise<void> {
  try {
    const availableMigrations = getAvailableMigrations();
    const appliedMigrations = await getAppliedMigrations();
    const appliedVersions = new Set(appliedMigrations.map(m => m.version));

    console.log('\n📊 Migration Status:');
    console.log('====================');
    
    for (const migration of availableMigrations) {
      const status = appliedVersions.has(migration.version) ? '✅ Applied' : '⏳ Pending';
      const appliedInfo = appliedVersions.has(migration.version) 
        ? ` (${appliedMigrations.find(m => m.version === migration.version)?.applied_at})`
        : '';
      
      console.log(`${status} ${migration.version}: ${migration.name}${appliedInfo}`);
    }
    
    console.log(`\nTotal migrations: ${availableMigrations.length}`);
    console.log(`Applied: ${appliedMigrations.length}`);
    console.log(`Pending: ${availableMigrations.length - appliedMigrations.length}`);
  } catch (error) {
    console.error('❌ Failed to get migration status:', error);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'up':
      migrateUp();
      break;
    case 'down':
      migrateDown();
      break;
    case 'status':
      migrationStatus();
      break;
    default:
      console.log('Usage: npm run migrate <up|down|status>');
      break;
  }
}