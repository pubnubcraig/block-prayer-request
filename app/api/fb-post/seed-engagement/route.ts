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
    // Get existing content types to only insert new ones
    const existing = await db.select().from(engagementTopics);
    const existingTypes = new Set(existing.map((t) => t.contentType));

    const newTopics = ENGAGEMENT_SEED_TOPICS.filter(
      (t) => !existingTypes.has(t.contentType),
    );

    if (newTopics.length === 0) {
      return NextResponse.json({
        ok: true,
        message: `All content types already seeded (${existing.length} topics)`,
      });
    }

    await db.insert(engagementTopics).values(
      newTopics.map((t) => ({
        contentType: t.contentType,
        prompt: t.prompt,
        verseReference: t.verseReference ?? null,
        verseText: t.verseText ?? null,
        triviaAnswer: t.triviaAnswer ?? null,
      })),
    );

    const insertedTypes = [...new Set(newTopics.map((t) => t.contentType))];
    return NextResponse.json({
      ok: true,
      inserted: newTopics.length,
      contentTypes: insertedTypes,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fb-post/seed-engagement] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
