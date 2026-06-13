import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { count } = await req.json();
  if (typeof count !== 'number' || count < 0) {
    return NextResponse.json({ error: 'Invalid count' }, { status: 400 });
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 });
  }

  const redis = new Redis({ url, token });
  await redis.set('prayers_served', count);

  return NextResponse.json({ success: true, prayers_served: count });
}
