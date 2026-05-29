import { getDb } from '@/lib/db';
import { prayerTopics } from '@/lib/db/schema';
import { eq, and, or, lt, isNull, sql } from 'drizzle-orm';

export async function selectRandomTopic() {
  const db = getDb();
  if (!db) throw new Error('Database unavailable');

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const [topic] = await db
    .select()
    .from(prayerTopics)
    .where(
      and(
        eq(prayerTopics.active, true),
        or(
          isNull(prayerTopics.lastUsedAt),
          lt(prayerTopics.lastUsedAt, ninetyDaysAgo),
        ),
      ),
    )
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!topic) {
    // All topics used recently — pick the least recently used
    const [fallback] = await db
      .select()
      .from(prayerTopics)
      .where(eq(prayerTopics.active, true))
      .orderBy(prayerTopics.lastUsedAt)
      .limit(1);

    if (!fallback) throw new Error('No active prayer topics found');
    return fallback;
  }

  return topic;
}
