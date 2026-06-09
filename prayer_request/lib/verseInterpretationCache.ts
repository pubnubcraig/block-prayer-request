import { getDb } from '@/lib/db';
import { bibleVerseInterpretations } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { normalizeVerseReference } from './normalizeVerseReference.js';
import { INTERPRETATION_PROMPT_VERSION } from './promptVersion.js';

export type CachedInterpretation = {
  interpretation: string;
  fromCache: boolean;
};

/**
 * Look up a cached verse interpretation.
 * Returns null on cache miss or any error (never breaks the prayer flow).
 */
export async function getCachedInterpretation(
  bibleVerse: string,
  translation: string,
): Promise<CachedInterpretation | null> {
  try {
    const db = getDb();
    if (!db) return null;

    const ref = normalizeVerseReference(bibleVerse);
    const trans = translation.toUpperCase();

    const row = await db
      .select()
      .from(bibleVerseInterpretations)
      .where(
        and(
          eq(bibleVerseInterpretations.verseReference, ref),
          eq(bibleVerseInterpretations.translation, trans),
          eq(bibleVerseInterpretations.promptVersion, INTERPRETATION_PROMPT_VERSION),
        ),
      )
      .limit(1)
      .then((rows) => rows[0] ?? null);

    if (!row) return null;

    // Fire-and-forget usage tracking
    updateUsageStats(row.id).catch((e) =>
      console.error('[cache] Failed to update usage stats:', e),
    );

    return { interpretation: row.interpretation, fromCache: true };
  } catch (e) {
    console.error('[cache] getCachedInterpretation error:', e);
    return null;
  }
}

/**
 * Store a verse interpretation in the cache.
 * Uses upsert to handle duplicate prevention via the unique constraint.
 * Never throws — logs errors and returns silently.
 */
export async function cacheInterpretation(
  bibleVerse: string,
  translation: string,
  verseContent: string,
  interpretation: string,
  modelUsed: string,
): Promise<void> {
  try {
    const db = getDb();
    if (!db) return;

    const ref = normalizeVerseReference(bibleVerse);
    const trans = translation.toUpperCase();

    await db
      .insert(bibleVerseInterpretations)
      .values({
        verseReference: ref,
        translation: trans,
        verseContent,
        interpretation,
        promptVersion: INTERPRETATION_PROMPT_VERSION,
        modelUsed,
      })
      .onConflictDoUpdate({
        target: [
          bibleVerseInterpretations.verseReference,
          bibleVerseInterpretations.translation,
        ],
        set: {
          interpretation,
          verseContent,
          promptVersion: INTERPRETATION_PROMPT_VERSION,
          modelUsed,
          lastUsedAt: sql`now()`,
        },
      });
  } catch (e) {
    console.error('[cache] cacheInterpretation error:', e);
  }
}

async function updateUsageStats(id: string): Promise<void> {
  try {
    const db = getDb();
    if (!db) return;

    await db
      .update(bibleVerseInterpretations)
      .set({
        usageCount: sql`${bibleVerseInterpretations.usageCount} + 1`,
        lastUsedAt: sql`now()`,
      })
      .where(eq(bibleVerseInterpretations.id, id));
  } catch (e) {
    console.error('[cache] updateUsageStats error:', e);
  }
}
