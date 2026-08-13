import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { instagramPostLog } from '@/lib/db/schema';
import { eq, and, gte, isNotNull, isNull } from 'drizzle-orm';
import { getMediaInsights } from '@/lib/ig-post/instagram-client';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'DB unavailable' }, { status: 503 });
  }

  // Get successful posts from last 7 days that have an Instagram media ID
  // but haven't had analytics collected yet
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const posts = await db
    .select()
    .from(instagramPostLog)
    .where(
      and(
        eq(instagramPostLog.status, 'success'),
        gte(instagramPostLog.postedAt, sevenDaysAgo),
        isNotNull(instagramPostLog.instagramPostId),
        isNull(instagramPostLog.reach),
      ),
    )
    .limit(25);

  let updated = 0;
  let failed = 0;

  for (const post of posts) {
    try {
      const insights = await getMediaInsights(post.instagramPostId!);

      await db
        .update(instagramPostLog)
        .set({
          reach: insights.reach,
          impressions: insights.impressions,
          saves: insights.saves,
          shares: insights.shares,
          comments: insights.comments,
          likes: insights.likes,
          profileVisits: insights.profileVisits,
          websiteClicks: insights.websiteClicks,
        })
        .where(eq(instagramPostLog.id, post.id));

      updated++;
    } catch (err) {
      console.warn(
        `[ig-analytics] Failed to fetch insights for post ${post.id}:`,
        err,
      );
      failed++;
    }

    // Rate limit: wait 500ms between API calls
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(
    `[ig-analytics] Updated ${updated} posts, ${failed} failed, ${posts.length} total`,
  );

  return NextResponse.json({
    ok: true,
    total: posts.length,
    updated,
    failed,
  });
}
