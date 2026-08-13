import { getDb } from '@/lib/db';
import { prayerTopics, instagramPostLog } from '@/lib/db/schema';
import { eq, and, or, lt, isNull, sql, desc, ne } from 'drizzle-orm';

export type InstagramTheme =
  | 'hope_encouragement'
  | 'engagement_interactive'
  | 'prayer_reflection';

const THEME_PREFERRED_CATEGORIES: Record<InstagramTheme, string[]> = {
  hope_encouragement: ['Comfort', 'Hope', 'Strength', 'Peace', 'Praise'],
  engagement_interactive: [
    'Relationships',
    'Family',
    'Purpose',
    'Community',
    'Service',
  ],
  prayer_reflection: [
    'Faith',
    'Patience',
    'Protection',
    'Guidance',
    'Forgiveness',
    'Wisdom',
  ],
};

// Seasonal category boosts by month (0-indexed)
const SEASONAL_BOOSTS: Record<number, string[]> = {
  0: ['Hope', 'Faith'], // January — New Year
  1: ['Relationships', 'Family'], // February — Valentine's
  2: ['Hope', 'Faith', 'Forgiveness'], // March — Lent/Easter
  3: ['Hope', 'Faith', 'Praise'], // April — Easter
  4: ['Family', 'Service'], // May — Mother's Day
  5: ['Family', 'Strength'], // June — Father's Day
  6: ['Purpose', 'Guidance'], // July
  7: ['Community', 'Service'], // August — Back to school
  8: ['Wisdom', 'Faith'], // September
  9: ['Protection', 'Strength'], // October
  10: ['Praise', 'Provision'], // November — Thanksgiving
  11: ['Hope', 'Peace', 'Praise'], // December — Christmas
};

export async function selectInstagramTopic(theme: InstagramTheme) {
  const db = getDb();
  if (!db) throw new Error('Database unavailable');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Get categories used in the last 2 Instagram posts to avoid consecutive repeats
  const recentPosts = await db
    .select({
      topicId: instagramPostLog.topicId,
    })
    .from(instagramPostLog)
    .where(eq(instagramPostLog.status, 'success'))
    .orderBy(desc(instagramPostLog.postedAt))
    .limit(2);

  const recentTopicIds = recentPosts
    .map((p) => p.topicId)
    .filter(Boolean) as string[];

  // Get recent categories for consecutive avoidance
  let recentCategories: string[] = [];
  if (recentTopicIds.length > 0) {
    const recentTopics = await db
      .select({ category: prayerTopics.category })
      .from(prayerTopics)
      .where(
        sql`${prayerTopics.id} IN (${sql.join(
          recentTopicIds.map((id) => sql`${id}::uuid`),
          sql`, `,
        )})`,
      );
    recentCategories = recentTopics.map((t) => t.category);
  }

  // Get category usage counts from last 7 days for balancing
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const categoryUsage = await db
    .select({
      category: prayerTopics.category,
      count: sql<number>`count(*)::int`,
    })
    .from(instagramPostLog)
    .innerJoin(prayerTopics, eq(instagramPostLog.topicId, prayerTopics.id))
    .where(
      and(
        eq(instagramPostLog.status, 'success'),
        sql`${instagramPostLog.postedAt} >= ${sevenDaysAgo}`,
      ),
    )
    .groupBy(prayerTopics.category);

  const categoryCountMap = new Map(
    categoryUsage.map((c) => [c.category, c.count]),
  );

  // Get eligible topics (not used in last 30 days on Instagram)
  let eligibleTopics = await db
    .select()
    .from(prayerTopics)
    .where(
      and(
        eq(prayerTopics.active, true),
        or(
          isNull(prayerTopics.lastUsedAtInstagram),
          lt(prayerTopics.lastUsedAtInstagram, thirtyDaysAgo),
        ),
      ),
    );

  if (eligibleTopics.length === 0) {
    // Fallback: pick least recently used
    eligibleTopics = await db
      .select()
      .from(prayerTopics)
      .where(eq(prayerTopics.active, true))
      .orderBy(prayerTopics.lastUsedAtInstagram)
      .limit(20);
  }

  if (eligibleTopics.length === 0) {
    throw new Error('No active prayer topics found');
  }

  // Filter out consecutive categories
  let filtered = eligibleTopics.filter(
    (t) => !recentCategories.includes(t.category),
  );
  if (filtered.length === 0) filtered = eligibleTopics;

  // Score each topic
  const preferredCategories = THEME_PREFERRED_CATEGORIES[theme] ?? [];
  const month = new Date().getMonth();
  const seasonalCategories = SEASONAL_BOOSTS[month] ?? [];

  const scored = filtered.map((topic) => {
    let score = 1;

    // Theme alignment bonus
    if (preferredCategories.includes(topic.category)) score += 3;

    // Seasonal relevance bonus
    if (seasonalCategories.includes(topic.category)) score += 2;

    // Category balancing: prefer underrepresented categories
    const usage = categoryCountMap.get(topic.category) ?? 0;
    score += Math.max(0, 5 - usage);

    // Never-used-on-Instagram bonus
    if (!topic.lastUsedAtInstagram) score += 1;

    return { topic, score };
  });

  // Weighted random selection
  const totalScore = scored.reduce((sum, s) => sum + s.score, 0);
  let random = Math.random() * totalScore;

  for (const entry of scored) {
    random -= entry.score;
    if (random <= 0) return entry.topic;
  }

  // Fallback to last entry
  return scored[scored.length - 1].topic;
}

export function topicToSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
