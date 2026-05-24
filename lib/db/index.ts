import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

/**
 * Get database client. Returns null if DATABASE_URL is not configured.
 * This allows the app to run without a database during early phases.
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  const sql = neon(url);
  return drizzle(sql, { schema });
}
