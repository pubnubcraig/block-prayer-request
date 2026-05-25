import { createHash } from 'node:crypto';
import { getDb } from './db/index';
import { moderationLogs } from './db/schema';

type ModerationLogEntry = {
  category: string;
  severity: string;
  actionTaken: string;
  ip: string;
};

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
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

  const db = getDb();
  if (db) {
    await db.insert(moderationLogs).values({
      category: entry.category,
      severity: entry.severity,
      actionTaken: entry.actionTaken,
      ipHash,
    });
  }
}
