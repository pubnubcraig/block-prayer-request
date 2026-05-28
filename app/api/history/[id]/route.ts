import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { prayerHistory } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 },
    );
  }

  const entry = await db.query.prayerHistory.findFirst({
    where: and(
      eq(prayerHistory.id, id),
      eq(prayerHistory.userId, session.user.id),
      isNull(prayerHistory.deletedAt),
    ),
  });

  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ entry });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 },
    );
  }

  const result = await db
    .update(prayerHistory)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(prayerHistory.id, id),
        eq(prayerHistory.userId, session.user.id),
        isNull(prayerHistory.deletedAt),
      ),
    )
    .returning({ id: prayerHistory.id });

  if (result.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
