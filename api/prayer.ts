import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runPrayerRequest } from '../prayer_request/lib/apiAdapter.js';

export const config = {
  maxDuration: 180,
};

type RequestBody = {
  text?: unknown;
  bible_version?: unknown;
};

function readBody(req: VercelRequest): RequestBody {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body as RequestBody;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body) as RequestBody;
  }
  return {};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'prayer_request',
      usage: 'POST JSON { "text": "...", "bible_version": "ESV" }',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body: RequestBody;
  try {
    body = readBody(req);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  const bible_version =
    typeof body.bible_version === 'string' ? body.bible_version : undefined;

  try {
    const result = await runPrayerRequest({ text, bible_version });
    return res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const status =
      message === 'text is required' ||
      message.startsWith('Missing or empty field:') ||
      message === 'Invalid JSON in request part.'
        ? 400
        : 500;
    return res.status(status).json({ error: message });
  }
}
