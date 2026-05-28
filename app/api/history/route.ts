import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { prayerHistory } from '@/lib/db/schema';
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
