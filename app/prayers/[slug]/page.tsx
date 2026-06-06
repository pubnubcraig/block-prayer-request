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
  params: Promise<{ slug: string }>;
};

async function getAllTopics() {
  const db = getDb();
  if (!db) return [];
  return db.select().from(prayerTopics).where(eq(prayerTopics.active, true));
}

async function findTopicBySlug(slug: string) {
  const topics = await getAllTopics();
  return topics.find((t) => slugify(t.topic) === slug) ?? null;
}

async function getRelatedTopics(category: string, excludeSlug: string) {
  const topics = await getAllTopics();
  return topics
    .filter((t) => t.category === category && slugify(t.topic) !== excludeSlug)
    .slice(0, 6);
}

export async function generateStaticParams() {
  const topics = await getAllTopics();
  return topics.map((t) => ({ slug: slugify(t.topic) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await findTopicBySlug(slug);
  if (!topic) return {};

  const title = `Prayer for ${topic.topic} — Bible Verses & Guidance | GoFish.Life`;
  const description = `Find a Scripture-based prayer for ${topic.topic.toLowerCase()}. Read ${topic.verseReference} and receive biblical guidance and a personalized prayer.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://gofish.life/prayers/${slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://gofish.life/prayers/${slug}`,
    },
  };
}

export default async function PrayerTopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = await findTopicBySlug(slug);
  if (!topic) notFound();

  const related = await getRelatedTopics(topic.category, slug);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'Prayers', url: 'https://gofish.life/prayers' },
    { name: topic.topic, url: `https://gofish.life/prayers/${slug}` },
  ]);

  return (
    <div className="max-w-[720px] mx-auto px-5 pt-8 pb-16">
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
        <span>{topic.topic}</span>
      </nav>

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-6 tracking-tight">
        Prayer for {topic.topic}
      </h1>

      {/* Featured Bible verse */}
      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          {topic.verseReference}
        </h2>
        <blockquote className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 border-l-3 border-seateal pl-4 italic">
          &ldquo;{topic.verseText}&rdquo;
        </blockquote>
      </section>

      {/* CTA */}
      <section className="card mb-6 text-center">
        <h2 className="text-lg font-bold mb-2 tracking-tight">
          Submit Your Own Prayer Request
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed mb-4">
          Share your specific concern about {topic.topic.toLowerCase()} and
          receive a personalized Bible verse, interpretation, and prayer.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-seateal text-white font-semibold no-underline hover:opacity-90 transition-opacity"
        >
          Get a Personalized Prayer
        </Link>
      </section>

      {/* Related topics */}
      {related.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-4 tracking-tight">
            Related Prayer Topics
          </h2>
          <div className="grid grid-cols-3 gap-3 max-[520px]:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/prayers/${slugify(r.topic)}`}
                className="topic-chip text-center no-underline"
              >
                {r.topic}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Cross-link to Bible verses */}
      <p className="text-[0.9rem] text-[var(--ink-muted)]">
        Looking for verses?{' '}
        <Link
          href={`/bible-verses/${slug}`}
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          Bible Verses About {topic.topic} &rarr;
        </Link>
      </p>

      <SiteFooter />
    </div>
  );
}
