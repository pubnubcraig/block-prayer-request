import { NextRequest, NextResponse } from 'next/server';
import { incrementPrayedCount } from '@/lib/prayer-wall/queries';
import { logPrayerWallEvent } from '@/lib/prayer-wall/analytics';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const prayedCount = await incrementPrayedCount(slug);
    if (prayedCount === null) {
      return NextResponse.json(
        { error: 'Prayer not found.' },
        { status: 404 },
      );
    }

    logPrayerWallEvent({ event: 'prayer_wall_prayed', slug });

    return NextResponse.json({ prayedCount });
  } catch (err) {
    console.error(
      '[prayer-wall] Failed to increment prayed count:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to record prayer.' },
      { status: 500 },
    );
  }
}
