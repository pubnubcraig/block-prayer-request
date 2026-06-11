import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { engagementTopics } from '@/lib/db/schema';
import { ENGAGEMENT_SEED_TOPICS } from '@/lib/fb-post/seed-engagement-topics';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });
  }

  try {
    const existing = await db.select().from(engagementTopics);
    if (existing.length > 0) {
      return NextResponse.json({
        ok: true,
        message: `Already seeded (${existing.length} topics)`,
      });
    }

    await db.insert(engagementTopics).values(
      ENGAGEMENT_SEED_TOPICS.map((t) => ({
        contentType: t.contentType,
        prompt: t.prompt,
        verseReference: t.verseReference ?? null,
        verseText: t.verseText ?? null,
        triviaAnswer: t.triviaAnswer ?? null,
      })),
    );

    return NextResponse.json({ ok: true, inserted: ENGAGEMENT_SEED_TOPICS.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fb-post/seed-engagement] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
