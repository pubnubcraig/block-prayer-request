import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const redis = getRedis();
  if (!redis) {
    return res.status(200).json({ prayers_served: 0 });
  }

  try {
    const count = await redis.get<number>('prayers_served');
    return res.status(200).json({ prayers_served: count ?? 0 });
  } catch (err) {
    console.error('[stats] Redis error:', err instanceof Error ? err.message : err);
    return res.status(200).json({ prayers_served: 0 });
  }
}
