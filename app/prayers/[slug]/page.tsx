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
  // Pick one topic per category (deterministic: first alphabetically)
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

  const title = `Prayer for ${topic.topic} — Scripture-Based Prayer & Guidance | GoFish.Life`;
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
  const crossCategory = await getCrossCategoryTopics(topic.category, slug);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://gofish.life' },
    { name: 'Prayers', url: 'https://gofish.life/prayers' },
    { name: topic.topic, url: `https://gofish.life/prayers/${slug}` },
  ]);

  const articleSchema = generateArticleSchema({
    title: `Prayer for ${topic.topic}`,
    description: `Scripture-based prayer for ${topic.topic.toLowerCase()} with ${topic.verseReference}.`,
    url: `https://gofish.life/prayers/${slug}`,
    datePublished: topic.createdAt?.toISOString(),
    section: topic.category,
    keywords: [
      `prayer for ${topic.topic.toLowerCase()}`,
      topic.topic.toLowerCase(),
      'scripture prayer',
      topic.category.toLowerCase(),
    ],
  });

  const faqItems = [
    {
      question: `How do I pray about ${topic.topic.toLowerCase()}?`,
      answer: `Start with Scripture: ${topic.verseReference} says, "${topic.verseText}" Meditate on this verse, then bring your specific concern to God in honest prayer. GoFish.Life can help you receive a personalized, Scripture-based prayer for ${topic.topic.toLowerCase()}.`,
    },
    {
      question: `What Bible verse helps with ${topic.topic.toLowerCase()}?`,
      answer: `${topic.verseReference} is a key verse for ${topic.topic.toLowerCase()}: "${topic.verseText}" You can find more verses on our Bible Verses About ${topic.topic} page.`,
    },
    {
      question: `Can I get a personalized prayer for ${topic.topic.toLowerCase()}?`,
      answer: `Yes. GoFish.Life lets you share your specific concern about ${topic.topic.toLowerCase()} and receive a personalized Bible verse, faithful interpretation, practical guidance, and a written prayer — completely free and private.`,
    },
    {
      question: `Is there a sample prayer for ${topic.topic.toLowerCase()}?`,
      answer: topic.samplePrayer
        ? `Yes. Here is a sample prayer: "${topic.samplePrayer.slice(0, 200)}..." Visit GoFish.Life to read the full prayer and submit your own personalized request.`
        : `GoFish.Life can generate a personalized prayer for ${topic.topic.toLowerCase()} based on Scripture. Share your specific concern to receive a prayer grounded in God's Word.`,
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
          href="/prayers"
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          Prayers
        </Link>
        <span className="mx-2">/</span>
        <span>{topic.topic}</span>
      </nav>

      <h1 className="font-serif font-semibold text-3xl mt-0 mb-3 tracking-tight">
        Prayer for {topic.topic}
      </h1>
      <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed mb-6">
        Looking for a prayer about {topic.topic.toLowerCase()}? Read{' '}
        {topic.verseReference}, find a Scripture-based prayer, and submit your
        own personalized prayer request grounded in God&apos;s Word.
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
      </section>

      {/* Sample prayer */}
      {topic.samplePrayer && (
        <section id="prayer" className="card mb-6">
          <h2 className="text-lg font-bold mb-3 tracking-tight">
            A Prayer for {topic.topic}
          </h2>
          <p className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed m-0 whitespace-pre-line">
            {topic.samplePrayer}
          </p>
        </section>
      )}

      {/* Prayer prompts */}
      {topic.prayerPrompts && (() => {
        const prompts = JSON.parse(topic.prayerPrompts) as string[];
        return prompts.length > 0 ? (
          <section id="reflect" className="card mb-6">
            <h2 className="text-lg font-bold mb-3 tracking-tight">
              Reflect &amp; Pray
            </h2>
            <ul className="m-0 pl-5 grid gap-2">
              {prompts.map((prompt, i) => (
                <li key={i} className="text-[var(--ink-muted)] text-[0.95rem] leading-relaxed">
                  {prompt}
                </li>
              ))}
            </ul>
          </section>
        ) : null;
      })()}

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
