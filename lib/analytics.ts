import { getDb } from './db/index';
import { prayerUsageMetrics } from './db/schema';

type PrayerMetrics = {
  bibleVersion: string;
  tokensUsed: number;
  responseTimeMs: number;
  costCents: number;
};

export async function logPrayerMetrics(metrics: PrayerMetrics): Promise<void> {
  console.log(
    JSON.stringify({
      event: 'prayer_metrics',
      bible_version: metrics.bibleVersion,
      tokens_used: metrics.tokensUsed,
      response_time_ms: metrics.responseTimeMs,
      cost_cents: metrics.costCents,
      timestamp: new Date().toISOString(),
    }),
  );

  const db = getDb();
  if (db) {
    await db.insert(prayerUsageMetrics).values({
      bibleVersion: metrics.bibleVersion,
      tokensUsed: metrics.tokensUsed,
      responseTimeMs: Math.round(metrics.responseTimeMs),
      costCents: metrics.costCents,
    });
  }
}
