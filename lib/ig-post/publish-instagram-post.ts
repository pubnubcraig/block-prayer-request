// Shared handler for all 3 Instagram cron routes.
// Orchestrates: topic selection → image generation → caption generation →
// reel generation → Instagram publishing → story publishing → logging.

import { getDb } from '@/lib/db';
import { prayerTopics, instagramPostLog } from '@/lib/db/schema';
import { eq, and, gte, inArray } from 'drizzle-orm';
import {
  selectInstagramTopic,
  topicToSlug,
  type InstagramTheme,
} from './select-instagram-topic';
import { generateTopicImage } from './generate-image';
import {
  generateInstagramCaption,
  generateFallbackCaption,
} from './generate-caption';
import { generateStoryImage } from './generate-story';
import { generateReel } from './generate-reel';
import { selectMusicClip } from './music-library';
import {
  publishImagePost,
  publishStory,
  publishReel,
  postFirstComment,
} from './instagram-client';
import { notifyInstagramFailure } from './notify-failure';

export type PostType = 'morning_hope' | 'noon_engagement' | 'evening_prayer';

const POST_TYPE_THEME: Record<PostType, InstagramTheme> = {
  morning_hope: 'hope_encouragement',
  noon_engagement: 'engagement_interactive',
  evening_prayer: 'prayer_reflection',
};

export type PublishResult = {
  ok: boolean;
  skipped?: boolean;
  message?: string;
  instagramPostId?: string;
  topicId?: string;
  status?: string;
  error?: string;
};

export async function publishInstagramPost(
  postType: PostType,
): Promise<PublishResult> {
  const db = getDb();
  if (!db) {
    console.error('[ig-post] Database unavailable');
    return { ok: false, error: 'DB unavailable' };
  }

  const theme = POST_TYPE_THEME[postType];

  // ── Duplicate check ──────────────────────────────────────────────
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [existingPost] = await db
    .select()
    .from(instagramPostLog)
    .where(
      and(
        eq(instagramPostLog.postType, postType),
        inArray(instagramPostLog.status, ['success', 'fallback']),
        gte(instagramPostLog.postedAt, todayStart),
      ),
    )
    .limit(1);

  if (existingPost) {
    console.log(`[ig-post] Already posted ${postType} today, skipping`);
    return { ok: true, skipped: true, message: `Already posted ${postType} today` };
  }

  let topicId: string | null = null;
  let caption: string | null = null;
  let imageUrl: string | null = null;
  let storyImageUrl: string | null = null;
  let reelVideoUrl: string | null = null;
  let musicClipUrl: string | null = null;

  try {
    // ── Select topic ─────────────────────────────────────────────────
    const topic = await selectInstagramTopic(theme);
    topicId = topic.id;
    const slug = topicToSlug(topic.topic);
    console.log(`[ig-post] Selected topic: "${topic.topic}" (${topic.id})`);

    const topicInput = {
      topic: topic.topic,
      category: topic.category,
      verseReference: topic.verseReference,
      verseText: topic.verseText,
    };

    // ── Generate image ───────────────────────────────────────────────
    console.log(`[ig-post] Generating images for "${topic.topic}"...`);
    const images = await generateTopicImage(topic.topic, topic.category, theme);
    imageUrl = images.imageUrl;
    storyImageUrl = images.storyImageUrl;

    // ── Generate caption ─────────────────────────────────────────────
    let captionResult;
    let usedFallback = false;
    try {
      captionResult = await generateInstagramCaption(topicInput, theme);
    } catch (aiError) {
      console.warn('[ig-post] Caption generation failed, retrying...', aiError);
      try {
        captionResult = await generateInstagramCaption(topicInput, theme);
      } catch (retryError) {
        console.warn('[ig-post] Caption retry failed, using fallback', retryError);
        captionResult = generateFallbackCaption(topicInput);
        usedFallback = true;
      }
    }
    caption = captionResult.fullCaption;

    // ── Generate reel (non-blocking) ─────────────────────────────────
    const musicClip = selectMusicClip(theme);
    if (musicClip?.url) {
      musicClipUrl = musicClip.url;
      try {
        console.log(`[ig-post] Generating reel with music "${musicClip.name}"...`);
        const reelResult = await generateReel({
          imageUrl,
          musicUrl: musicClip.url,
          scriptureText: topicInput.verseText.length <= 200
            ? topicInput.verseText
            : undefined,
          scriptureReference: topicInput.verseReference,
          durationSeconds: musicClip.durationSeconds,
        });
        reelVideoUrl = reelResult.videoUrl;
      } catch (reelError) {
        console.warn('[ig-post] Reel generation failed (non-blocking):', reelError);
      }
    }

    // ── Publish feed post (up to 3 retries) ──────────────────────────
    let instagramPostId: string | null = null;
    let instagramMediaId: string | null = null;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await publishImagePost(imageUrl, caption);
        instagramPostId = result.postId;
        instagramMediaId = result.mediaId;
        console.log(`[ig-post] Published to Instagram: ${instagramPostId}`);
        break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(
          `[ig-post] Instagram publish attempt ${attempt}/3 failed:`,
          lastError.message,
        );
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 2000 * attempt));
        }
      }
    }

    // ── Post first comment ───────────────────────────────────────────
    if (instagramPostId && captionResult.firstComment) {
      try {
        await postFirstComment(instagramPostId, captionResult.firstComment);
        console.log('[ig-post] First comment posted');
      } catch (commentError) {
        console.warn('[ig-post] First comment failed (non-blocking):', commentError);
      }
    }

    // ── Publish story (non-blocking) ─────────────────────────────────
    let storyPublishUrl = storyImageUrl;
    try {
      const storyResult = await generateStoryImage({
        storyImageUrl: storyImageUrl!,
        hookText: captionResult.hookLine,
        scriptureText: topicInput.verseText.length <= 150
          ? topicInput.verseText
          : topicInput.verseText.substring(0, 147) + '...',
        scriptureReference: topicInput.verseReference,
        topicSlug: slug,
      });
      storyPublishUrl = storyResult.storyUrl;
    } catch (storyGenError) {
      console.warn('[ig-post] Story overlay generation failed, using raw image:', storyGenError);
    }

    if (storyPublishUrl) {
      try {
        await publishStory(storyPublishUrl);
        console.log('[ig-post] Story published');
      } catch (storyError) {
        console.warn('[ig-post] Story publish failed (non-blocking):', storyError);
      }
    }

    // ── Publish reel (non-blocking) ──────────────────────────────────
    if (reelVideoUrl) {
      try {
        await publishReel(reelVideoUrl, caption);
        console.log('[ig-post] Reel published');
      } catch (reelPublishError) {
        console.warn('[ig-post] Reel publish failed (non-blocking):', reelPublishError);
      }
    }

    // ── Update topic lastUsedAtInstagram ──────────────────────────────
    await db
      .update(prayerTopics)
      .set({ lastUsedAtInstagram: new Date() })
      .where(eq(prayerTopics.id, topic.id));

    // ── Log result ───────────────────────────────────────────────────
    const status = instagramPostId
      ? usedFallback
        ? 'fallback'
        : 'success'
      : 'failed';

    await db.insert(instagramPostLog).values({
      topicId: topic.id,
      postType,
      postTheme: theme,
      caption,
      hashtags: JSON.stringify(captionResult.hashtags),
      firstComment: captionResult.firstComment,
      imageUrl,
      storyImageUrl: storyPublishUrl,
      reelVideoUrl,
      musicClipUrl,
      instagramMediaId,
      instagramPostId,
      topicUrl: `https://gofish.life/prayer-topics/${slug}`,
      postedAt: instagramPostId ? new Date() : null,
      status,
      errorMessage: lastError?.message ?? null,
    });

    // ── Notify on failure ────────────────────────────────────────────
    if (!instagramPostId) {
      await notifyInstagramFailure(
        lastError?.message ?? 'Unknown error',
        { topicId: topic.id, topic: topic.topic, postType, attempts: 3 },
      ).catch((e) =>
        console.error('[ig-post] Failed to send failure notification:', e),
      );

      return {
        ok: false,
        error: 'Instagram publish failed after 3 attempts',
        topicId: topic.id,
      };
    }

    return {
      ok: true,
      instagramPostId,
      topicId: topic.id,
      status,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[ig-post] Unhandled error (${postType}):`, message);

    // Log the failure
    try {
      await db.insert(instagramPostLog).values({
        topicId,
        postType,
        postTheme: theme,
        caption,
        imageUrl,
        storyImageUrl,
        reelVideoUrl,
        musicClipUrl,
        instagramMediaId: null,
        instagramPostId: null,
        postedAt: null,
        status: 'failed',
        errorMessage: message,
      });
    } catch (logErr) {
      console.error('[ig-post] Failed to log error:', logErr);
    }

    await notifyInstagramFailure(message, {
      topicId,
      postType,
      phase: 'unhandled',
    }).catch((e) =>
      console.error('[ig-post] Failed to send failure notification:', e),
    );

    return { ok: false, error: message };
  }
}
