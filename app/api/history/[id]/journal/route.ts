import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { prayerHistory, prayerJournalEntries } from '@/lib/db/schema';
import { eq, and, isNull, asc } from 'drizzle-orm';

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

  // Verify prayer belongs to user
  const prayer = await db.query.prayerHistory.findFirst({
    where: and(
      eq(prayerHistory.id, id),
      eq(prayerHistory.userId, session.user.id),
      isNull(prayerHistory.deletedAt),
    ),
    columns: { id: true },
  });

  if (!prayer) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const entries = await db
    .select()
    .from(prayerJournalEntries)
    .where(
      and(
        eq(prayerJournalEntries.prayerId, id),
        eq(prayerJournalEntries.userId, session.user.id),
      ),
    )
    .orderBy(asc(prayerJournalEntries.createdAt));

  return NextResponse.json({ entries });
}

export async function POST(
  req: NextRequest,
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

  // Verify prayer belongs to user
  const prayer = await db.query.prayerHistory.findFirst({
    where: and(
      eq(prayerHistory.id, id),
      eq(prayerHistory.userId, session.user.id),
      isNull(prayerHistory.deletedAt),
    ),
    columns: { id: true },
  });

  if (!prayer) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Parse and validate body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const entryText =
    typeof body.entry_text === 'string' ? body.entry_text.trim() : '';
  const entryType =
    typeof body.entry_type === 'string' ? body.entry_type : 'journal';

  if (!entryText) {
    return NextResponse.json(
      { error: 'entry_text is required.' },
      { status: 400 },
    );
  }

  if (entryType !== 'journal' && entryType !== 'answered') {
    return NextResponse.json(
      { error: 'entry_type must be "journal" or "answered".' },
      { status: 400 },
    );
  }

  // If marking as answered, update prayer status
  if (entryType === 'answered') {
    await db
      .update(prayerHistory)
      .set({ status: 'answered' })
      .where(eq(prayerHistory.id, id));
  }

  const [entry] = await db
    .insert(prayerJournalEntries)
    .values({
      prayerId: id,
      userId: session.user.id,
      entryText,
      entryType,
    })
    .returning();

  return NextResponse.json({ entry }, { status: 201 });
}
