import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { engagementTopics, facebookPostLog } from '@/lib/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { selectEngagementTopic } from '@/lib/fb-post/select-engagement-topic';
import { generateEngagementPost } from '@/lib/fb-post/generate-engagement-post';
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
    console.error('[fb-post-sunday-poll] Database unavailable');
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });
  }

  // ── 3. Duplicate check — skip if prayer_poll already posted today
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [existingPost] = await db
    .select()
    .from(facebookPostLog)
    .where(
      and(
        eq(facebookPostLog.postType, 'engagement'),
        eq(facebookPostLog.status, 'success'),
        gte(facebookPostLog.postedAt, todayStart),
        sql`${facebookPostLog.topicId} IN (
          SELECT id FROM engagement_topics WHERE content_type = 'prayer_poll'
        )`,
      ),
    )
    .limit(1);

  if (existingPost) {
    console.log('[fb-post-sunday-poll] Already posted today, skipping');
    return NextResponse.json({
      ok: true,
      skipped: true,
      message: 'Already posted today',
    });
  }

  let topicId: string | null = null;
  let postContent: string | null = null;

  try {
    // ── 4. Select prayer_poll topic ────────────────────────────────
    const topic = await selectEngagementTopic('prayer_poll');
    topicId = topic.id;
    console.log(
      `[fb-post-sunday-poll] Selected topic: "${topic.contentType}" (${topic.id})`,
    );

    // ── 5. Generate engagement post (template-based, no AI) ────────
    const { content } = generateEngagementPost(topic);
    postContent = content;

    // ── 6. Publish to Facebook (up to 3 retries) ───────────────────
    let facebookPostId: string | null = null;
    let lastFbError: Error | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await publishToPage(postContent);
        facebookPostId = result.postId;
        console.log(
          `[fb-post-sunday-poll] Published to Facebook: ${facebookPostId}`,
        );
        break;
      } catch (fbError) {
        lastFbError =
          fbError instanceof Error ? fbError : new Error(String(fbError));
        console.warn(
          `[fb-post-sunday-poll] Facebook attempt ${attempt}/3 failed:`,
          lastFbError.message,
        );
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 2000 * attempt));
        }
      }
    }

    if (!facebookPostId) {
      // Facebook publish failed
      await db.insert(facebookPostLog).values({
        topicId: topic.id,
        postType: 'engagement',
        postContent,
        facebookPostId: null,
        postedAt: null,
        status: 'failed',
        errorMessage: lastFbError?.message ?? 'Unknown error',
      });

      await notifyPostFailure(
        lastFbError?.message ?? 'Unknown error',
        {
          topicId: topic.id,
          contentType: topic.contentType,
          attempts: 3,
          postType: 'engagement',
        },
      ).catch((e) =>
        console.error(
          '[fb-post-sunday-poll] Failed to send failure notification:',
          e,
        ),
      );

      return NextResponse.json(
        { error: 'Facebook publish failed after 3 attempts' },
        { status: 502 },
      );
    }

    // ── 7. Update topic last_used_at ─────────────────────────────
    await db
      .update(engagementTopics)
      .set({ lastUsedAt: new Date() })
      .where(eq(engagementTopics.id, topic.id));

    // ── 8. Log success ───────────────────────────────────────────
    await db.insert(facebookPostLog).values({
      topicId: topic.id,
      postType: 'engagement',
      postContent,
      facebookPostId,
      postedAt: new Date(),
      status: 'success',
      errorMessage: null,
    });

    return NextResponse.json({
      ok: true,
      facebookPostId,
      topicId: topic.id,
      contentType: topic.contentType,
      status: 'success',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[fb-post-sunday-poll] Unhandled error:', message);

    // Log the failure
    try {
      await db.insert(facebookPostLog).values({
        topicId,
        postType: 'engagement',
        postContent,
        facebookPostId: null,
        postedAt: null,
        status: 'failed',
        errorMessage: message,
      });
    } catch (logErr) {
      console.error('[fb-post-sunday-poll] Failed to log error:', logErr);
    }

    // Notify admin
    await notifyPostFailure(message, {
      topicId,
      phase: 'unhandled',
      postType: 'engagement',
    }).catch((e) =>
      console.error(
        '[fb-post-sunday-poll] Failed to send failure notification:',
        e,
      ),
    );

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
