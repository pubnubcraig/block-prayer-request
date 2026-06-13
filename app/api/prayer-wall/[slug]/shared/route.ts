import { NextRequest, NextResponse } from 'next/server';
import { incrementShareCount } from '@/lib/prayer-wall/queries';
import { logPrayerWallEvent } from '@/lib/prayer-wall/analytics';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let platform = 'unknown';
  try {
    const body = await req.json();
    if (typeof body.platform === 'string') {
      platform = body.platform;
    }
  } catch {
    // No body is fine
  }

  try {
    const shareCount = await incrementShareCount(slug);
    if (shareCount === null) {
      return NextResponse.json(
        { error: 'Prayer not found.' },
        { status: 404 },
      );
    }

    logPrayerWallEvent({
      event: 'prayer_wall_share_click',
      slug,
      platform,
    });

    return NextResponse.json({ shareCount });
  } catch (err) {
    console.error(
      '[prayer-wall] Failed to increment share count:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to record share.' },
      { status: 500 },
    );
  }
}
