import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
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

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  });

  if (!profile) {
    return NextResponse.json({ profile: null });
  }

  return NextResponse.json({
    profile: {
      favoriteVerse: profile.favoriteVerse,
      bibleVersion: profile.bibleVersion,
      denomination: profile.denomination,
      faithStage: profile.faithStage,
      prayerTopics: profile.prayerTopics
        ? JSON.parse(profile.prayerTopics)
        : [],
      dateOfBirth: profile.dateOfBirth,
      sex: profile.sex,
      maritalStatus: profile.maritalStatus,
      occupation: profile.occupation,
      churchName: profile.churchName,
      timezone: profile.timezone,
      prayerHistoryMode: profile.prayerHistoryMode,
    },
  });
}

export async function PUT(request: NextRequest) {
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const {
    favoriteVerse,
    bibleVersion,
    denomination,
    faithStage,
    prayerTopics,
    dateOfBirth,
    sex,
    maritalStatus,
    occupation,
    churchName,
    timezone,
    prayerHistoryMode,
  } = body as Record<string, string | string[] | null>;

  try {
    await db
      .update(userProfiles)
      .set({
        favoriteVerse: (favoriteVerse as string) || null,
        bibleVersion: (bibleVersion as string) || 'NIV',
        denomination: (denomination as string) || null,
        faithStage: (faithStage as string) || null,
        prayerTopics: prayerTopics
          ? JSON.stringify(prayerTopics)
          : null,
        dateOfBirth: (dateOfBirth as string) || null,
        sex: (sex as string) || null,
        maritalStatus: (maritalStatus as string) || null,
        occupation: (occupation as string) || null,
        churchName: (churchName as string) || null,
        timezone: (timezone as string) || null,
        prayerHistoryMode: (prayerHistoryMode as string) || 'save-per-request',
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, session.user.id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
      '[profile] Error:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to update profile.' },
      { status: 500 },
    );
  }
}
