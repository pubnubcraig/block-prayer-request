import { neon } from '@neondatabase/serverless';

type PrayerMetrics = {
  bibleVersion: string;
  tokensUsed: number;
  responseTimeMs: number;
  costCents: number;
};

let tablesReady = false;

function getDbUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

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

  const url = getDbUrl();
  if (!url) return;

  const sql = neon(url);

  if (!tablesReady) {
    await sql`CREATE TABLE IF NOT EXISTS prayer_usage_metrics (
      id SERIAL PRIMARY KEY,
      bible_version VARCHAR(50) NOT NULL,
      tokens_used INTEGER NOT NULL,
      response_time_ms INTEGER NOT NULL,
      cost_cents INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;
    tablesReady = true;
  }

  await sql`INSERT INTO prayer_usage_metrics (bible_version, tokens_used, response_time_ms, cost_cents)
    VALUES (${metrics.bibleVersion}, ${metrics.tokensUsed}, ${Math.round(metrics.responseTimeMs)}, ${metrics.costCents})`;
}
