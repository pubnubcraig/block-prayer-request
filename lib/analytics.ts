type PrayerMetrics = {
  bibleVersion: string;
  tokensUsed: number;
  responseTimeMs: number;
  costCents: number;
};

/**
 * Log prayer usage metrics.
 * When DATABASE_URL is available, this will insert into prayer_usage_metrics.
 * For now, logs structured JSON to console for observability.
 */
export async function logPrayerMetrics(metrics: PrayerMetrics): Promise<void> {
  // TODO: Insert into prayer_usage_metrics table when DB is provisioned
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
}
