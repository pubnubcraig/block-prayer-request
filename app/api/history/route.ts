import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { prayerHistory, userProfiles } from '@/lib/db/schema';
import { eq, and, isNull, desc, count } from 'drizzle-orm';

const FREE_TIER_LIMIT = 12;

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
  const limit = Math.min(
    FREE_TIER_LIMIT,
    Math.max(1, parseInt(url.searchParams.get('limit') ?? String(FREE_TIER_LIMIT), 10)),
  );
  const offset = (page - 1) * limit;

  const where = and(
    eq(prayerHistory.userId, session.user.id),
    isNull(prayerHistory.deletedAt),
  );

  const [items, [countRow]] = await Promise.all([
    db
      .select()
      .from(prayerHistory)
      .where(where)
      .orderBy(desc(prayerHistory.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(prayerHistory).where(where),
  ]);

  const total = countRow?.total ?? 0;
  // Free tier: cap visible items at FREE_TIER_LIMIT
  const cappedTotal = Math.min(total, FREE_TIER_LIMIT);

  return NextResponse.json({
    items: items.slice(0, FREE_TIER_LIMIT - offset),
    page,
    limit,
    total: cappedTotal,
    totalPages: Math.ceil(cappedTotal / limit),
    plan: 'free',
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 },
    );
  }

  // Check user's prayerHistoryMode allows saving
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
    columns: { prayerHistoryMode: true },
  });
  const mode = profile?.prayerHistoryMode ?? 'save-per-request';
  if (mode === 'do-not-save') {
    return NextResponse.json(
      { error: 'Saving is disabled in your profile settings.' },
      { status: 403 },
    );
  }

  // Check FREE_TIER_LIMIT
  const [countRow] = await db
    .select({ total: count() })
    .from(prayerHistory)
    .where(
      and(
        eq(prayerHistory.userId, session.user.id),
        isNull(prayerHistory.deletedAt),
      ),
    );
  if ((countRow?.total ?? 0) >= FREE_TIER_LIMIT) {
    return NextResponse.json(
      { error: 'Prayer history limit reached for free tier.' },
      { status: 403 },
    );
  }

  // Parse and validate body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const requestText = typeof body.requestText === 'string' ? body.requestText : '';
  const bibleVerse = typeof body.bibleVerse === 'string' ? body.bibleVerse : '';
  const prayer = typeof body.prayer === 'string' ? body.prayer : '';

  if (!requestText || !bibleVerse || !prayer) {
    return NextResponse.json(
      { error: 'Missing required fields.' },
      { status: 400 },
    );
  }

  await db.insert(prayerHistory).values({
    userId: session.user.id,
    requestText,
    bibleVerse,
    verseContent: typeof body.verseContent === 'string' ? body.verseContent : null,
    interpretation: typeof body.interpretation === 'string' ? body.interpretation : null,
    advice: typeof body.advice === 'string' ? body.advice : null,
    prayer,
    bibleVersionUsed: typeof body.bibleVersionUsed === 'string' ? body.bibleVersionUsed : null,
  });

  return NextResponse.json({ success: true });
}
