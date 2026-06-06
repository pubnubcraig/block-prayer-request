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
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
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

async function getCrossCategoryTopics(
  excludeCategory: string,
  excludeSlug: string,
) {
  const topics = await getAllTopics();
  const seen = new Set<string>();
  return topics
    .filter((t) => {
      if (t.category === excludeCategory || slugify(t.topic) === excludeSlug)
        return false;
      if (seen.has(t.category)) return false;
      seen.add(t.category);
      return true;
    })
    .slice(0, 3);
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
  const crossCategory = await getCrossCategoryTopics(topic.category, slug);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'Bible Verses', url: 'https://gofish.life/bible-verses' },
    {
      name: topic.topic,
      url: `https://gofish.life/bible-verses/${slug}`,
    },
  ]);

  const articleSchema = generateArticleSchema({
    title: `Bible Verses About ${topic.topic}`,
    description: `Read ${topic.verseReference} and other Bible verses about ${topic.topic.toLowerCase()}.`,
    url: `https://gofish.life/bible-verses/${slug}`,
    datePublished: topic.createdAt?.toISOString(),
    section: topic.category,
    keywords: [
      `bible verses about ${topic.topic.toLowerCase()}`,
      topic.topic.toLowerCase(),
      'scripture',
      topic.category.toLowerCase(),
    ],
  });

  const faqItems = [
    {
      question: `What does the Bible say about ${topic.topic.toLowerCase()}?`,
      answer: `${topic.verseReference} says, "${topic.verseText}" This and other passages offer Scripture-based wisdom and encouragement for ${topic.topic.toLowerCase()}.`,
    },
    {
      question: `What is the best Bible verse for ${topic.topic.toLowerCase()}?`,
      answer: `${topic.verseReference} is often cited for ${topic.topic.toLowerCase()}: "${topic.verseText}" Additional verses can be found on this page.`,
    },
    {
      question: `How many Bible verses are there about ${topic.topic.toLowerCase()}?`,
      answer: `The Bible contains many passages about ${topic.topic.toLowerCase()}. This page highlights ${topic.verseReference}${topic.additionalVerses ? ` along with ${(JSON.parse(topic.additionalVerses) as unknown[]).length} additional verses` : ''} to encourage and guide you.`,
    },
    {
      question: `How can I pray using Bible verses about ${topic.topic.toLowerCase()}?`,
      answer: `Read ${topic.verseReference}, reflect on its meaning for your situation, then bring your concern to God in prayer. GoFish.Life can generate a personalized prayer based on Scripture for ${topic.topic.toLowerCase()}.`,
    },
  ];

  const faqSchema = generateFAQSchema(faqItems);

  return (
    <div className="max-w-[720px] mx-auto px-5 pt-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            wrapInGraph([breadcrumbSchema, articleSchema, faqSchema]),
          ),
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

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-3 tracking-tight">
        Bible Verses About {topic.topic}
      </h1>
      <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed mb-6">
        The Bible speaks directly to {topic.topic.toLowerCase()}. Read{' '}
        {topic.verseReference} and other Scripture passages to find
        encouragement, wisdom, and hope for your situation.
      </p>

      {/* Featured Bible verse */}
      <section id="featured-verse" className="card mb-6">
        <h2 className="text-lg font-bold mb-3 tracking-tight">
          {topic.verseReference}
        </h2>
        <figure className="m-0">
          <blockquote className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 border-l-3 border-seateal pl-4 italic">
            &ldquo;{topic.verseText}&rdquo;
          </blockquote>
          <figcaption className="text-[var(--ink-subtle)] text-[0.82rem] mt-2">
            &mdash; {topic.verseReference}
          </figcaption>
        </figure>
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
          <section id="additional-verses" className="mb-6">
            <h2 className="text-lg font-bold mb-4 tracking-tight">
              More Verses About {topic.topic}
            </h2>
            <div className="grid gap-4">
              {verses.map((verse) => (
                <div key={verse.reference} className="card">
                  <figure className="m-0">
                    <h3 className="text-[0.95rem] font-bold mb-2 tracking-tight">
                      {verse.reference}
                    </h3>
                    <blockquote className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 border-l-3 border-seateal pl-4 italic">
                      &ldquo;{verse.text}&rdquo;
                    </blockquote>
                    <figcaption className="text-[var(--ink-subtle)] text-[0.82rem] mt-2">
                      &mdash; {verse.reference}
                    </figcaption>
                  </figure>
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

      {/* FAQ */}
      <section id="faq" className="card mb-6">
        <h2 className="text-lg font-bold mb-4 tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-3">
          {faqItems.map((faq, i) => (
            <details key={i} className="group">
              <summary className="font-semibold text-[0.95rem] cursor-pointer list-none flex items-start gap-2 text-[var(--ink)] hover:text-seateal transition-colors [&::-webkit-details-marker]:hidden">
                <span className="text-seateal mt-0.5 shrink-0 transition-transform group-open:rotate-90">&#9654;</span>
                {faq.question}
              </summary>
              <p className="text-[var(--ink-muted)] text-[0.92rem] leading-relaxed mt-2 ml-5 mb-0">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
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

      {/* Cross-category topics */}
      {crossCategory.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-4 tracking-tight">
            You Might Also Explore
          </h2>
          <div className="grid grid-cols-3 gap-3 max-[520px]:grid-cols-2">
            {crossCategory.map((r) => (
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
