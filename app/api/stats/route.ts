import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ prayers_served: 0 });
  }

  try {
    const count = await redis.get<number>('prayers_served');
    return NextResponse.json({ prayers_served: count ?? 0 });
  } catch (err) {
    console.error(
      '[stats] Redis error:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ prayers_served: 0 });
  }
}
