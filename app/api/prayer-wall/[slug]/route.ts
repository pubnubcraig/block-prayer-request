import { NextRequest, NextResponse } from 'next/server';
import { getSharedPrayerBySlug } from '@/lib/prayer-wall/queries';
import { logPrayerWallEvent } from '@/lib/prayer-wall/analytics';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const prayer = await getSharedPrayerBySlug(slug);
    if (!prayer) {
      return NextResponse.json(
        { error: 'Prayer not found.' },
        { status: 404 },
      );
    }

    logPrayerWallEvent({ event: 'prayer_wall_view', slug });

    return NextResponse.json({
      id: prayer.id,
      publicTitle: prayer.publicTitle,
      publicSummary: prayer.publicSummary,
      requestText: prayer.requestText,
      verseReference: prayer.verseReference,
      verseText: prayer.verseText,
      prayerExcerpt: prayer.prayerExcerpt,
      fullPrayer: prayer.fullPrayer,
      interpretation: prayer.interpretation,
      practicalGuidance: prayer.practicalGuidance,
      displayNameType: prayer.displayNameType,
      firstName: prayer.firstName,
      slug: prayer.slug,
      prayedCount: prayer.prayedCount,
      shareCount: prayer.shareCount,
      createdAt: prayer.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(
      '[prayer-wall] Failed to fetch shared prayer:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to load prayer.' },
      { status: 500 },
    );
  }
}
