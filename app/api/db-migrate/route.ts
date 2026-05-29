import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expectedToken = process.env.OPENAI_API_KEY;

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url =
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;
  if (!url) {
    return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
  }

  try {
    const sql = neon(url);

    // Original tables
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

    // Auth tables
    await sql`CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) NOT NULL UNIQUE,
      email_verified TIMESTAMP,
      image TEXT,
      hashed_password TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS accounts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(255) NOT NULL,
      provider VARCHAR(255) NOT NULL,
      provider_account_id VARCHAR(255) NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type VARCHAR(255),
      scope VARCHAR(255),
      id_token TEXT,
      session_state VARCHAR(255)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS sessions (
      session_token VARCHAR(255) PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TIMESTAMP NOT NULL
    )`;

    await sql`CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier VARCHAR(255) NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires TIMESTAMP NOT NULL,
      PRIMARY KEY (identifier, token)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS user_profiles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      favorite_verse TEXT,
      bible_version VARCHAR(10) DEFAULT 'NIV',
      denomination VARCHAR(100),
      faith_stage VARCHAR(50),
      prayer_topics TEXT,
      date_of_birth TEXT,
      sex TEXT,
      marital_status VARCHAR(30),
      occupation VARCHAR(100),
      church_name VARCHAR(200),
      timezone VARCHAR(60),
      prayer_history_mode VARCHAR(20) DEFAULT 'save-per-request',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS prayer_history (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      request_text TEXT,
      bible_verse VARCHAR(255),
      verse_content TEXT,
      interpretation TEXT,
      advice TEXT,
      prayer TEXT,
      bible_version_used VARCHAR(50),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMP
    )`;

    // Facebook prayer post tables
    await sql`CREATE TABLE IF NOT EXISTS prayer_topics (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      topic VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      verse_reference VARCHAR(100) NOT NULL,
      verse_text TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true,
      last_used_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS facebook_post_log (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      topic_id UUID REFERENCES prayer_topics(id),
      post_content TEXT,
      facebook_post_id VARCHAR(255),
      posted_at TIMESTAMP,
      status VARCHAR(20) NOT NULL,
      error_message TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    // List tables to confirm
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;

    return NextResponse.json({
      ok: true,
      message: 'All tables created successfully',
      tables: tables.map((t: Record<string, string>) => t.table_name),
      db_url_source: process.env.NEON_DATABASE_URL
        ? 'NEON_DATABASE_URL'
        : process.env.DATABASE_URL
          ? 'DATABASE_URL'
          : 'POSTGRES_URL',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
