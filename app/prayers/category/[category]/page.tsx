import { cache } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

type Props = {
  params: Promise<{ category: string }>;
};

const getAllTopics = cache(async () => {
  const db = getDb();
  if (!db) return [];
  return db.select().from(prayerTopics).where(eq(prayerTopics.active, true));
});

function getCategories(topics: Awaited<ReturnType<typeof getAllTopics>>) {
  const categories = new Set<string>();
  for (const t of topics) categories.add(t.category);
  return Array.from(categories).sort();
}

function findCategory(
  topics: Awaited<ReturnType<typeof getAllTopics>>,
  slug: string,
) {
  const categories = getCategories(topics);
  return categories.find((c) => slugify(c) === slug) ?? null;
}

export async function generateStaticParams() {
  const topics = await getAllTopics();
  const categories = getCategories(topics);
  return categories.map((c) => ({ category: slugify(c) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const topics = await getAllTopics();
  const category = findCategory(topics, categorySlug);
  if (!category) return {};

  const topicNames = topics
    .filter((t) => t.category === category)
    .slice(0, 4)
    .map((t) => t.topic.toLowerCase())
    .join(', ');

  const title = `${category} Prayers — Scripture-Based Prayers | GoFish.Life`;
  const description = `Browse Scripture-based prayers for ${category.toLowerCase()}: ${topicNames}, and more. Each includes a Bible verse, reflection prompts, and guidance.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://gofish.life/prayers/category/${categorySlug}`,
    },
    alternates: {
      canonical: `https://gofish.life/prayers/category/${categorySlug}`,
    },
  };
}

export default async function PrayerCategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const topics = await getAllTopics();
  const category = findCategory(topics, categorySlug);
  if (!category) notFound();

  const categoryTopics = topics.filter((t) => t.category === category);
  const allCategories = getCategories(topics);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'Prayers', url: 'https://gofish.life/prayers' },
    {
      name: category,
      url: `https://gofish.life/prayers/category/${categorySlug}`,
    },
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
        <Link
          href="/prayers"
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          Prayers
        </Link>
        <span className="mx-2">/</span>
        <span>{category}</span>
      </nav>

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-2 tracking-tight">
        {category} Prayers
      </h1>
      <p className="text-[var(--ink-muted)] mb-10 text-[0.95rem] max-w-[40rem]">
        Browse Scripture-based prayers about {category.toLowerCase()}. Select a
        topic to read a relevant Bible verse, sample prayer, and reflection
        prompts.
      </p>

      <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-3 max-[520px]:grid-cols-2 mb-12">
        {categoryTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/prayers/${slugify(topic.topic)}`}
            className="topic-chip text-center no-underline"
          >
            {topic.topic}
          </Link>
        ))}
      </div>

      {/* Other categories */}
      <section>
        <h2 className="text-lg font-bold mb-4 tracking-tight">
          More Prayer Categories
        </h2>
        <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-3 max-[520px]:grid-cols-2">
          {allCategories
            .filter((c) => c !== category)
            .map((c) => (
              <Link
                key={c}
                href={`/prayers/category/${slugify(c)}`}
                className="topic-chip text-center no-underline"
              >
                {c}
              </Link>
            ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
