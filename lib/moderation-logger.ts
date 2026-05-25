import { createHash } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

type ModerationLogEntry = {
  category: string;
  severity: string;
  actionTaken: string;
  ip: string;
};

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

let tableReady = false;

function getDbUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

export async function logModeration(entry: ModerationLogEntry): Promise<void> {
  const ipHash = hashIp(entry.ip);

  console.log(
    JSON.stringify({
      event: 'moderation_log',
      category: entry.category,
      severity: entry.severity,
      action_taken: entry.actionTaken,
      ip_hash: ipHash,
      timestamp: new Date().toISOString(),
    }),
  );

  const url = getDbUrl();
  if (!url) return;

  const sql = neon(url);

  if (!tableReady) {
    await sql`CREATE TABLE IF NOT EXISTS moderation_logs (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      severity VARCHAR(50) NOT NULL,
      action_taken VARCHAR(50) NOT NULL,
      ip_hash VARCHAR(64),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;
    tableReady = true;
  }

  await sql`INSERT INTO moderation_logs (category, severity, action_taken, ip_hash)
    VALUES (${entry.category}, ${entry.severity}, ${entry.actionTaken}, ${ipHash})`;
}
