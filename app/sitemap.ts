import type { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';
import { prayerTopics } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/utils/slugify';

const BASE_URL = 'https://gofish.life';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/prayers`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/bible-verses`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/faq`, lastModified: '2025-05-01', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: '2025-05-01', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/feedback`, lastModified: '2025-05-01', changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: '2025-05-01', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: '2025-05-01', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/transparency`, lastModified: '2025-05-01', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/data-deletion`, lastModified: '2025-05-01', changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic prayer topic pages
  const db = getDb();
  if (!db) return staticPages;

  const topics = await db
    .select({ topic: prayerTopics.topic, category: prayerTopics.category })
    .from(prayerTopics)
    .where(eq(prayerTopics.active, true));

  // Category pages
  const categories = Array.from(new Set(topics.map((t) => t.category))).sort();
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((c) => {
    const catSlug = slugify(c);
    return [
      {
        url: `${BASE_URL}/prayers/category/${catSlug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      },
      {
        url: `${BASE_URL}/bible-verses/category/${catSlug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      },
    ];
  });

  // Individual topic pages
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

  return [...staticPages, ...categoryPages, ...topicPages];
}
