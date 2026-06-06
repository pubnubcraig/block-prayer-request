import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle<typeof schema>> | null | undefined;

/**
 * Get database client. Returns null if DATABASE_URL is not configured.
 * Uses a singleton so connections are reused across calls.
 */
export function getDb() {
  if (_db !== undefined) return _db;

  const url = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    _db = null;
    return null;
  }

  const client = postgres(url, { prepare: false });
  _db = drizzle(client, { schema });
  return _db;
}
