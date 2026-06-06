import Link from 'next/link';
import type { Metadata } from 'next';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import { getDb } from '@/lib/db';
import { prayerTopics } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/utils/slugify';
import {
  generateBreadcrumbSchema,
  wrapInGraph,
} from '@/lib/utils/structured-data';

export const metadata: Metadata = {
  title: 'Prayers by Topic — GoFish.Life',
  description:
    'Browse Scripture-based prayers organized by topic. Find prayers for anxiety, marriage, healing, strength, peace, and 100+ other life situations.',
  openGraph: {
    title: 'Prayers by Topic — GoFish.Life',
    description:
      'Browse Scripture-based prayers organized by topic with relevant Bible verses and spiritual guidance.',
    url: 'https://gofish.life/prayers',
  },
  alternates: {
    canonical: 'https://gofish.life/prayers',
  },
};

export default async function PrayersIndexPage() {
  const db = getDb();
  if (!db) {
    return <p>Unable to load prayer topics.</p>;
  }

  const topics = await db
    .select()
    .from(prayerTopics)
    .where(eq(prayerTopics.active, true));

  // Group by category
  const categorized: Record<string, typeof topics> = {};
  for (const topic of topics) {
    if (!categorized[topic.category]) categorized[topic.category] = [];
    categorized[topic.category].push(topic);
  }

  // Sort categories alphabetically
  const sortedCategories = Object.keys(categorized).sort();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'Prayers', url: 'https://gofish.life/prayers' },
  ]);

  return (
    <div className="max-w-[1180px] mx-auto px-5 pt-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(wrapInGraph([breadcrumbSchema])),
        }}
      />
      <SiteHeader />

      <nav
        aria-label="Breadcrumb"
        className="text-[0.82rem] text-[var(--ink-subtle)] mt-4 mb-6"
      >
        <Link
          href="/"
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          Home
        </Link>
        <span className="mx-2">/</span>
        <span>Prayers</span>
      </nav>

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-2 tracking-tight">
        Prayers by Topic
      </h1>
      <p className="text-[var(--ink-muted)] mb-10 text-[0.95rem] max-w-[40rem]">
        Find Scripture-based prayers for every situation in life. Select a topic
        to read a relevant Bible verse and submit your own personalized prayer
        request.
      </p>

      {sortedCategories.map((category) => (
        <section key={category} className="mb-10">
          <h2 className="text-lg font-bold mb-4 tracking-tight text-seateal">
            {category}
          </h2>
          <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-3 max-[520px]:grid-cols-2">
            {categorized[category].map((topic) => (
              <Link
                key={topic.id}
                href={`/prayers/${slugify(topic.topic)}`}
                className="topic-chip text-center no-underline"
              >
                {topic.topic}
              </Link>
            ))}
          </div>
        </section>
      ))}

      <SiteFooter />
    </div>
  );
}
