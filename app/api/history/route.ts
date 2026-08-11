import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { prayerHistory, prayerJournalEntries, userProfiles } from '@/lib/db/schema';
import { eq, and, or, isNull, desc, count, max, inArray, ilike, exists, notExists, sql } from 'drizzle-orm';

const PAGE_SIZE = 20;

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
    100,
    Math.max(1, parseInt(url.searchParams.get('limit') ?? String(PAGE_SIZE), 10)),
  );
  const offset = (page - 1) * limit;

  // Parse filter params
  const statusFilter = url.searchParams.get('status') ?? 'all';
  const journalFilter = url.searchParams.get('journal') ?? 'all';
  const searchQuery = url.searchParams.get('q')?.trim() ?? '';

  const conditions = [
    eq(prayerHistory.userId, session.user.id),
    isNull(prayerHistory.deletedAt),
  ];

  if (statusFilter === 'active' || statusFilter === 'answered') {
    conditions.push(eq(prayerHistory.status, statusFilter));
  }

  if (searchQuery) {
    const pattern = `%${searchQuery}%`;
    conditions.push(
      or(
        ilike(prayerHistory.requestText, pattern),
        ilike(prayerHistory.bibleVerse, pattern),
        ilike(prayerHistory.prayer, pattern),
      )!,
    );
  }

  if (journalFilter === 'has') {
    conditions.push(
      exists(
        db.select({ one: sql`1` }).from(prayerJournalEntries)
          .where(eq(prayerJournalEntries.prayerId, prayerHistory.id)),
      ),
    );
  } else if (journalFilter === 'none') {
    conditions.push(
      notExists(
        db.select({ one: sql`1` }).from(prayerJournalEntries)
          .where(eq(prayerJournalEntries.prayerId, prayerHistory.id)),
      ),
    );
  }

  const where = and(...conditions);

  const [rows, [countRow]] = await Promise.all([
    db
      .select()
      .from(prayerHistory)
      .where(where)
      .orderBy(desc(prayerHistory.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(prayerHistory).where(where),
  ]);

  // Fetch journal stats for the returned prayers in a single query
  const prayerIds = rows.map((r) => r.id);
  const journalStats =
    prayerIds.length > 0
      ? await db
          .select({
            prayerId: prayerJournalEntries.prayerId,
            entryCount: count(),
            lastEntryAt: max(prayerJournalEntries.createdAt),
          })
          .from(prayerJournalEntries)
          .where(inArray(prayerJournalEntries.prayerId, prayerIds))
          .groupBy(prayerJournalEntries.prayerId)
      : [];

  const statsMap = new Map(journalStats.map((s) => [s.prayerId, s]));
  const items = rows.map((row) => {
    const stats = statsMap.get(row.id);
    return {
      ...row,
      journalCount: stats?.entryCount ?? 0,
      lastJournalAt: stats?.lastEntryAt ?? null,
    };
  });

  const total = countRow?.total ?? 0;

  return NextResponse.json({
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
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
