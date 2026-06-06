import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { prayerHistory, prayerJournalEntries } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { entryId } = await params;
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 },
    );
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

  if (!entryText) {
    return NextResponse.json(
      { error: 'entry_text is required.' },
      { status: 400 },
    );
  }

  const result = await db
    .update(prayerJournalEntries)
    .set({ entryText, updatedAt: new Date() })
    .where(
      and(
        eq(prayerJournalEntries.id, entryId),
        eq(prayerJournalEntries.userId, session.user.id),
      ),
    )
    .returning();

  if (result.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ entry: result[0] });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, entryId } = await params;
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 },
    );
  }

  // Find the entry first to check its type
  const existing = await db.query.prayerJournalEntries.findFirst({
    where: and(
      eq(prayerJournalEntries.id, entryId),
      eq(prayerJournalEntries.userId, session.user.id),
    ),
    columns: { id: true, entryType: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Delete the entry
  await db
    .delete(prayerJournalEntries)
    .where(
      and(
        eq(prayerJournalEntries.id, entryId),
        eq(prayerJournalEntries.userId, session.user.id),
      ),
    );

  // If deleting an answered entry, revert prayer status to active
  if (existing.entryType === 'answered') {
    await db
      .update(prayerHistory)
      .set({ status: 'active' })
      .where(eq(prayerHistory.id, id));
  }

  return NextResponse.json({ success: true });
}
