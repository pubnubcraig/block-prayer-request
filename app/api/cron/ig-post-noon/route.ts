import { NextRequest, NextResponse } from 'next/server';
import { publishInstagramPost } from '@/lib/ig-post/publish-instagram-post';

export const maxDuration = 120;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await publishInstagramPost('noon_engagement');

  if (result.skipped) {
    return NextResponse.json(result);
  }

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === 'DB unavailable' ? 503 : 502 },
    );
  }

  return NextResponse.json(result);
}
