import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Get database client. Returns null if DATABASE_URL is not configured.
 * This allows the app to run without a database during early phases.
 */
export function getDb() {
  const url = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) return null;

  const client = postgres(url, { prepare: false });
  return drizzle(client, { schema });
}
