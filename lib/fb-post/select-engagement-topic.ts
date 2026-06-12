import { getDb } from '@/lib/db';
import { engagementTopics } from '@/lib/db/schema';
import { eq, and, lt, sql } from 'drizzle-orm';

export async function selectEngagementTopic(contentType?: string) {
  const db = getDb();
  if (!db) throw new Error('Database unavailable');

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const baseConditions = [
    eq(engagementTopics.active, true),
    ...(contentType
      ? [eq(engagementTopics.contentType, contentType)]
      : []),
  ];

  // Prefer topics unused in 90 days, distributed across content types
  const [topic] = await db
    .select()
    .from(engagementTopics)
    .where(
      and(
        ...baseConditions,
        lt(engagementTopics.lastUsedAt, ninetyDaysAgo),
      ),
    )
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!topic) {
    // All topics used recently — pick the least recently used
    const [fallback] = await db
      .select()
      .from(engagementTopics)
      .where(and(...baseConditions))
      .orderBy(engagementTopics.lastUsedAt)
      .limit(1);

    if (!fallback) throw new Error('No active engagement topics found');
    return fallback;
  }

  return topic;
}
