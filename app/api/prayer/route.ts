import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { checkRateLimit } from '@/lib/rate-limit';
import { logPrayerMetrics } from '@/lib/analytics';
import { logModeration } from '@/lib/moderation-logger';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { prayerHistory, userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const maxDuration = 180;

type PrayerRunner = typeof import('../../../prayer_request/lib/runPrayerCore');

let runnerPromise: Promise<PrayerRunner> | undefined;

function loadRunner(): Promise<PrayerRunner> {
  if (!runnerPromise) {
    runnerPromise = import('../../../prayer_request/lib/runPrayerCore');
  }
  return runnerPromise;
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rateLimitResult = checkRateLimit(ip);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error:
          'Too many requests. Please wait a moment before trying again.',
      },
      { status: 429 },
    );
  }

  let body: { text?: unknown; bible_version?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  const bible_version =
    typeof body.bible_version === 'string' ? body.bible_version : undefined;

  const startTime = performance.now();

  try {
    const { runPrayerCore } = await loadRunner();
    const result = await runPrayerCore({ text, bible_version });

    const responseTimeMs = Math.round(performance.now() - startTime);

    if ('error' in result) {
      const status =
        result.error === 'text is required' ||
        result.error.startsWith('Missing or empty field:') ||
        result.error === 'Invalid JSON in request part.'
          ? 400
          : 500;
      if (status >= 500) {
        console.error('[prayer] API error:', result.error);
      }
      return NextResponse.json(result, { status });
    }

    // Increment prayers-served counter (fire-and-forget)
    try {
      const url = process.env.KV_REST_API_URL;
      const token = process.env.KV_REST_API_TOKEN;
      if (url && token) {
        const redis = new Redis({ url, token });
        redis.incr('prayers_served').catch(() => {});
      }
    } catch {
      /* never break the prayer response */
    }

    // Log analytics (fire-and-forget)
    logPrayerMetrics({
      bibleVersion: bible_version || 'NIV',
      tokensUsed: result.tokensUsed ?? 0,
      responseTimeMs,
      costCents: result.costCents ?? 0,
    }).catch((e) => console.error('[analytics]', e));

    // Log moderation (fire-and-forget)
    if (result.moderationResult) {
      const mod = result.moderationResult;
      if (mod.flagged || mod.crisis) {
        logModeration({
          category: mod.categories.join(', ') || (mod.crisis ? 'crisis' : 'unknown'),
          severity: mod.crisis ? 'high' : 'medium',
          actionTaken: 'allowed',
          ip,
        }).catch((e) => console.error('[moderation]', e));
      }
    }

    // Strip internal fields before sending to client
    const { tokensUsed, costCents, moderationResult, ...clientResult } = result;

    // Determine save status and auto-save for save-all mode
    let saveStatus: 'auto-saved' | 'save-available' | 'save-disabled' | 'unauthenticated' = 'unauthenticated';
    try {
      const session = await auth();
      if (session?.user?.id) {
        const db = getDb();
        if (db) {
          const profile = await db.query.userProfiles.findFirst({
            where: eq(userProfiles.userId, session.user.id),
            columns: { prayerHistoryMode: true },
          });
          const mode = profile?.prayerHistoryMode ?? 'save-per-request';
          if (mode === 'save-all') {
            await db.insert(prayerHistory).values({
              userId: session.user.id,
              requestText: text,
              bibleVerse: result.bible_verse,
              verseContent: result.verse_content,
              interpretation: result.verse_interpretation,
              advice: result.advice,
              prayer: result.prayer,
              bibleVersionUsed: result.bible_version_used ?? null,
            });
            saveStatus = 'auto-saved';
          } else if (mode === 'save-per-request') {
            saveStatus = 'save-available';
          } else {
            saveStatus = 'save-disabled';
          }
        }
      }
    } catch (e) {
      console.error('[prayer] Failed to save history:', e instanceof Error ? e.message : e);
    }

    return NextResponse.json({ ...clientResult, saveStatus });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'prayer_request',
    usage: 'POST JSON { "text": "...", "bible_version": "NIV" }',
    blocks:
      'Provider must run blocks run on an always-on host (see render.yaml).',
  });
}
