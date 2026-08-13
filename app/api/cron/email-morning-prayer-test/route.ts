import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { facebookPostLog, prayerTopics } from '@/lib/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { sendMorningPrayerEmails } from '@/lib/fb-post/send-prayer-emails';

export const maxDuration = 60;

export async function GET(_req: NextRequest) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });

  const [latestLog] = await db.select().from(facebookPostLog)
    .where(and(eq(facebookPostLog.postType, 'daily_prayer'), inArray(facebookPostLog.status, ['success', 'fallback'])))
    .orderBy(desc(facebookPostLog.createdAt)).limit(1);

  if (!latestLog?.topicId || !latestLog.postContent)
    return NextResponse.json({ error: 'No post found' }, { status: 404 });

  const [topic] = await db.select().from(prayerTopics).where(eq(prayerTopics.id, latestLog.topicId)).limit(1);
  if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });

  await db.update(facebookPostLog).set({ emailNotificationSentAt: null }).where(eq(facebookPostLog.id, latestLog.id));
  await sendMorningPrayerEmails(latestLog.id, { topic: topic.topic, category: topic.category, verseReference: topic.verseReference, verseText: topic.verseText }, latestLog.postContent);

  return NextResponse.json({ ok: true, topic: topic.topic, verseReference: topic.verseReference, url: `https://gofish.life/prayers/${topic.topic.toLowerCase().replace(/\s+/g, '-')}` });
}
