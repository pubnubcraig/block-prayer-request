import type { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';
import { prayerTopics } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/utils/slugify';

const BASE_URL = 'https://gofish.life';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/prayers`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/bible-verses`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/faq`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/signup`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/login`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/feedback`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/transparency`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic prayer topic pages
  const db = getDb();
  if (!db) return staticPages;

  const topics = await db
    .select({ topic: prayerTopics.topic })
    .from(prayerTopics)
    .where(eq(prayerTopics.active, true));

  const topicPages: MetadataRoute.Sitemap = topics.flatMap((t) => {
    const slug = slugify(t.topic);
    return [
      {
        url: `${BASE_URL}/prayers/${slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/bible-verses/${slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];
  });

  return [...staticPages, ...topicPages];
}
