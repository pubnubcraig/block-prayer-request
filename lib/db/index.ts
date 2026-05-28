import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

/**
 * Get database client. Returns null if DATABASE_URL is not configured.
 * This allows the app to run without a database during early phases.
 */
export function getDb() {
  // NEON_DATABASE_URL takes priority — it always points to the main branch
  // where auth tables exist. The Neon integration may inject DATABASE_URL
  // pointing to per-branch databases that lack the schema.
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;

  const sql = neon(url);
  return drizzle(sql, { schema });
}
