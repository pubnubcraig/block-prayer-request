import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { prayerTopics, facebookPostLog } from '@/lib/db/schema';
import { eq, and, gte, inArray } from 'drizzle-orm';
import { selectRandomTopic } from '@/lib/fb-post/select-topic';
import {
  generateFacebookPost,
  generateFallbackPost,
} from '@/lib/fb-post/generate-post';
import { publishToPage } from '@/lib/fb-post/facebook-client';
import { notifyPostFailure } from '@/lib/fb-post/notify-failure';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  // ── 1. Verify cron secret ──────────────────────────────────────
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── 2. Check DB availability ───────────────────────────────────
  const db = getDb();
  if (!db) {
    console.error('[fb-post] Database unavailable');
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });
  }

  // ── 3. Duplicate check — skip if already posted today ──────────
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [existingPost] = await db
    .select()
    .from(facebookPostLog)
    .where(
      and(
        inArray(facebookPostLog.status, ['success', 'fallback']),
        gte(facebookPostLog.postedAt, todayStart),
      ),
    )
    .limit(1);

  if (existingPost) {
    console.log('[fb-post] Already posted today, skipping');
    return NextResponse.json({
      ok: true,
      skipped: true,
      message: 'Already posted today',
    });
  }

  let topicId: string | null = null;
  let postContent: string | null = null;

  try {
    // ── 4. Select topic ──────────────────────────────────────────
    const topic = await selectRandomTopic();
    topicId = topic.id;
    console.log(`[fb-post] Selected topic: "${topic.topic}" (${topic.id})`);

    // ── 5. Generate post content (1 retry, then fallback) ────────
    let usedFallback = false;
    const topicInput = {
      topic: topic.topic,
      category: topic.category,
      verseReference: topic.verseReference,
      verseText: topic.verseText,
    };

    try {
      const generated = await generateFacebookPost(topicInput);
      postContent = generated.content;
    } catch (aiError) {
      console.warn('[fb-post] OpenAI attempt 1 failed, retrying...', aiError);
      try {
        const generated = await generateFacebookPost(topicInput);
        postContent = generated.content;
      } catch (aiRetryError) {
        console.warn(
          '[fb-post] OpenAI retry failed, using fallback template',
          aiRetryError,
        );
        postContent = generateFallbackPost(topicInput);
        usedFallback = true;
      }
    }

    // ── 6. Publish to Facebook (up to 3 retries) ─────────────────
    let facebookPostId: string | null = null;
    let lastFbError: Error | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await publishToPage(postContent);
        facebookPostId = result.postId;
        console.log(`[fb-post] Published to Facebook: ${facebookPostId}`);
        break;
      } catch (fbError) {
        lastFbError =
          fbError instanceof Error ? fbError : new Error(String(fbError));
        console.warn(
          `[fb-post] Facebook attempt ${attempt}/3 failed:`,
          lastFbError.message,
        );
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 2000 * attempt));
        }
      }
    }

    // ── 7. Update topic last_used_at ─────────────────────────────
    await db
      .update(prayerTopics)
      .set({ lastUsedAt: new Date() })
      .where(eq(prayerTopics.id, topic.id));

    // ── 8. Log result ────────────────────────────────────────────
    const status = facebookPostId
      ? usedFallback
        ? 'fallback'
        : 'success'
      : 'failed';

    await db.insert(facebookPostLog).values({
      topicId: topic.id,
      postContent,
      facebookPostId,
      postedAt: facebookPostId ? new Date() : null,
      status,
      errorMessage: lastFbError?.message ?? null,
    });

    // ── 9. Notify on failure ─────────────────────────────────────
    if (!facebookPostId) {
      await notifyPostFailure(lastFbError?.message ?? 'Unknown error', {
        topicId: topic.id,
        topic: topic.topic,
        attempts: 3,
      }).catch((e) =>
        console.error('[fb-post] Failed to send failure notification:', e),
      );

      return NextResponse.json(
        { error: 'Facebook publish failed after 3 attempts' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      facebookPostId,
      topicId: topic.id,
      status,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fb-post] Unhandled error:', message);

    // Log the failure
    try {
      await db.insert(facebookPostLog).values({
        topicId,
        postContent,
        facebookPostId: null,
        postedAt: null,
        status: 'failed',
        errorMessage: message,
      });
    } catch (logErr) {
      console.error('[fb-post] Failed to log error:', logErr);
    }

    // Notify admin
    await notifyPostFailure(message, { topicId, phase: 'unhandled' }).catch(
      (e) =>
        console.error('[fb-post] Failed to send failure notification:', e),
    );

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
