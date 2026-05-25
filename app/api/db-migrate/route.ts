import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expectedToken = process.env.OPENAI_API_KEY;

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
  }

  try {
    const sql = neon(url);

    await sql`CREATE TABLE IF NOT EXISTS prayer_usage_metrics (
      id SERIAL PRIMARY KEY,
      bible_version VARCHAR(50) NOT NULL,
      tokens_used INTEGER NOT NULL,
      response_time_ms INTEGER NOT NULL,
      cost_cents INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS moderation_logs (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      severity VARCHAR(50) NOT NULL,
      action_taken VARCHAR(50) NOT NULL,
      ip_hash VARCHAR(64),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS app_stats (
      key VARCHAR(100) PRIMARY KEY,
      value BIGINT NOT NULL DEFAULT 0
    )`;

    return NextResponse.json({ ok: true, message: 'Tables created successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
