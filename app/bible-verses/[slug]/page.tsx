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
  params: Promise<{ slug: string }>;
};

const getAllTopics = cache(async () => {
  const db = getDb();
  if (!db) return [];
  return db.select().from(prayerTopics).where(eq(prayerTopics.active, true));
});

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

  const title = `Bible Verses About ${topic.topic} — Scripture & Guidance | GoFish.Life`;
  const description = `Read ${topic.verseReference} and other Bible verses about ${topic.topic.toLowerCase()}. Find Scripture-based encouragement and submit a personalized prayer request.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://gofish.life/bible-verses/${slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://gofish.life/bible-verses/${slug}`,
    },
  };
}

export default async function BibleVerseTopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = await findTopicBySlug(slug);
  if (!topic) notFound();

  const related = await getRelatedTopics(topic.category, slug);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'Bible Verses', url: 'https://gofish.life/bible-verses' },
    {
      name: topic.topic,
      url: `https://gofish.life/bible-verses/${slug}`,
    },
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
          href="/bible-verses"
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          Bible Verses
        </Link>
        <span className="mx-2">/</span>
        <span>{topic.topic}</span>
      </nav>

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-6 tracking-tight">
        Bible Verses About {topic.topic}
      </h1>

      {/* Featured Bible verse */}
      <section className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          {topic.verseReference}
        </h2>
        <blockquote className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 border-l-3 border-seateal pl-4 italic">
          &ldquo;{topic.verseText}&rdquo;
        </blockquote>
        {topic.verseContext && (
          <p className="text-[var(--ink-muted)] text-[0.88rem] leading-relaxed mt-4 mb-0">
            {topic.verseContext}
          </p>
        )}
      </section>

      {/* Additional verses */}
      {topic.additionalVerses && (() => {
        const verses = JSON.parse(topic.additionalVerses) as { reference: string; text: string }[];
        return verses.length > 0 ? (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-4 tracking-tight">
              More Verses About {topic.topic}
            </h2>
            <div className="grid gap-4">
              {verses.map((verse) => (
                <div key={verse.reference} className="card">
                  <h3 className="text-[0.95rem] font-bold mb-2 tracking-tight">
                    {verse.reference}
                  </h3>
                  <blockquote className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 border-l-3 border-seateal pl-4 italic">
                    &ldquo;{verse.text}&rdquo;
                  </blockquote>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      })()}

      {/* CTA */}
      <section className="card mb-6 text-center">
        <h2 className="text-lg font-bold mb-2 tracking-tight">
          Get a Personalized Prayer About {topic.topic}
        </h2>
        <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed mb-4">
          Share your specific concern and receive a personalized Bible verse,
          interpretation, and prayer grounded in Scripture.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-seateal text-white font-semibold no-underline hover:opacity-90 transition-opacity"
        >
          Submit a Prayer Request
        </Link>
      </section>

      {/* Related topics */}
      {related.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-4 tracking-tight">
            Related Bible Verse Topics
          </h2>
          <div className="grid grid-cols-3 gap-3 max-[520px]:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/bible-verses/${slugify(r.topic)}`}
                className="topic-chip text-center no-underline"
              >
                {r.topic}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Cross-link to prayers */}
      <p className="text-[0.9rem] text-[var(--ink-muted)]">
        Looking for prayers?{' '}
        <Link
          href={`/prayers/${slug}`}
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          Prayer for {topic.topic} &rarr;
        </Link>
      </p>

      <SiteFooter />
    </div>
  );
}
