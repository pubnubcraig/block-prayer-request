import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { prayerTopics } from '@/lib/db/schema';
import { SEED_TOPICS } from '@/lib/fb-post/seed-topics';

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
    const existing = await db.select().from(prayerTopics);
    if (existing.length > 0) {
      return NextResponse.json({
        ok: true,
        message: `Already seeded (${existing.length} topics)`,
      });
    }

    await db.insert(prayerTopics).values(
      SEED_TOPICS.map((t) => ({
        topic: t.topic,
        category: t.category,
        verseReference: t.verseReference,
        verseText: t.verseText,
      })),
    );

    return NextResponse.json({ ok: true, inserted: SEED_TOPICS.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fb-post/seed] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
