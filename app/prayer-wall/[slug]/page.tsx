import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import PrayerDetailClient from '@/components/prayer-wall/prayer-detail-client';
import { getSharedPrayerBySlug } from '@/lib/prayer-wall/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prayer = await getSharedPrayerBySlug(slug);

  if (!prayer) {
    return { title: 'Prayer Not Found — GoFish.Life' };
  }

  const attribution =
    prayer.displayNameType === 'first_name' && prayer.firstName
      ? `Shared by ${prayer.firstName}`
      : 'Shared anonymously';

  return {
    title: `${prayer.publicTitle} — Prayer Share Wall`,
    description: prayer.publicSummary,
    openGraph: {
      title: `${prayer.publicTitle} | Pray with someone today`,
      description: `${prayer.publicSummary} | ${attribution} on GoFish.Life`,
      url: `https://gofish.life/prayer-wall/${prayer.slug}`,
      type: 'article',
      images: [{ url: '/gofish-og.png', width: 1731, height: 909 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: prayer.publicTitle,
      description: prayer.publicSummary,
    },
    alternates: {
      canonical: `https://gofish.life/prayer-wall/${prayer.slug}`,
    },
  };
}

export default async function SharedPrayerPage({ params }: Props) {
  const { slug } = await params;
  const prayer = await getSharedPrayerBySlug(slug);

  if (!prayer) {
    notFound();
  }

  const attribution =
    prayer.displayNameType === 'first_name' && prayer.firstName
      ? `${prayer.firstName} asked for prayer`
      : 'Someone asked for prayer';

  const detail = {
    id: prayer.id,
    publicTitle: prayer.publicTitle,
    publicSummary: prayer.publicSummary,
    requestText: prayer.requestText,
    verseReference: prayer.verseReference,
    verseText: prayer.verseText,
    prayerExcerpt: prayer.prayerExcerpt,
    fullPrayer: prayer.fullPrayer,
    interpretation: prayer.interpretation,
    practicalGuidance: prayer.practicalGuidance,
    displayNameType: prayer.displayNameType as 'anonymous' | 'first_name',
    firstName: prayer.firstName,
    slug: prayer.slug,
    prayedCount: prayer.prayedCount,
    shareCount: prayer.shareCount,
    createdAt: prayer.createdAt.toISOString(),
  };

  return (
    <div className="max-w-[1180px] mx-auto px-5 pt-5 pb-12">
      <SiteHeader />

      <main>
        <div className="mb-6">
          <Link
            href="/prayer-wall"
            className="text-[0.85rem] text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
          >
            &larr; Back to Prayer Wall
          </Link>
        </div>

        <div className="mb-6">
          <p className="text-[0.85rem] text-[var(--ink-subtle)] m-0 mb-1">
            {attribution}
          </p>
          <h1 className="font-serif text-[1.8rem] tracking-tight m-0">
            {prayer.publicTitle}
          </h1>
          <p className="text-[var(--ink-muted)] text-[1.05rem] mt-2 mb-0 max-w-[700px]">
            {prayer.publicSummary}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1 mb-8">
          {/* Scripture card */}
          <article className="card col-span-2 max-[900px]:col-span-1">
            <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
              Scripture
            </div>
            <p className="font-serif font-semibold text-[1.35rem] mb-3">
              {prayer.verseReference}
            </p>
            <blockquote className="verse-text">{prayer.verseText}</blockquote>
          </article>

          {/* Interpretation card */}
          {prayer.interpretation && (
            <article className="card">
              <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
                Interpretation
              </div>
              <div className="whitespace-pre-wrap text-[var(--ink-muted)] text-[0.96rem]">
                {prayer.interpretation}
              </div>
            </article>
          )}

          {/* Guidance card */}
          {prayer.practicalGuidance && (
            <article className="card">
              <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
                Practical guidance
              </div>
              <div className="whitespace-pre-wrap text-[var(--ink-muted)] text-[0.96rem]">
                {prayer.practicalGuidance}
              </div>
            </article>
          )}

          {/* Prayer card */}
          <article className="card card-prayer col-span-2 max-[900px]:col-span-1">
            <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
              Prayer
            </div>
            <div className="whitespace-pre-wrap text-[var(--ink)] text-base">
              {prayer.fullPrayer}
            </div>
          </article>
        </div>

        <PrayerDetailClient prayer={detail} />

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] text-center">
          <h2 className="font-serif text-[1.4rem] mb-3 tracking-tight">
            Need prayer?
          </h2>
          <p className="text-[var(--ink-muted)] text-[0.95rem] mb-4">
            Submit your own prayer request at GoFish.Life.
          </p>
          <Link
            href="/"
            className="inline-block btn-submit text-[0.88rem] px-6 py-2.5 no-underline"
          >
            Submit a prayer request
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
