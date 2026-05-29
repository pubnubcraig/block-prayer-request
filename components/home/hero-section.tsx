'use client';

import Link from 'next/link';

function PrayerCounter({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div className="prayer-counter">
      <span className="font-serif font-bold text-[2rem] tracking-tight text-coral leading-none">
        {count.toLocaleString('en-US')}
      </span>
      <span className="text-[0.85rem] font-semibold tracking-[0.04em] uppercase text-[var(--ink-muted)]">
        prayers served
      </span>
    </div>
  );
}

export default function HeroSection({
  prayerCount,
  onRequestPrayer,
  isAuthenticated,
}: {
  prayerCount: number;
  onRequestPrayer: () => void;
  isAuthenticated: boolean;
}) {
  return (
    <section className="py-8 max-[900px]:py-4">
      <PrayerCounter count={prayerCount} />

      <p className="inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-coral mb-4 before:content-[''] before:w-7 before:h-0.5 before:bg-gradient-to-r before:from-coral before:to-seafoam before:rounded">
        A moment with God
      </p>

      <h1 className="font-serif font-semibold text-[clamp(2.25rem,4.5vw,3.35rem)] leading-[1.08] tracking-tight m-0 mb-4">
        Bring your concern.
        <br />
        <em className="italic text-coral">Receive hope.</em>
      </h1>

      <p className="text-[1.05rem] text-[var(--ink-muted)] max-w-[38rem] mb-7">
        Share what&apos;s on your heart and receive a relevant Bible verse,
        faithful interpretation, practical next steps, and a short prayer
        grounded in Scripture &mdash; completely free and private.
      </p>

      <ul className="grid gap-3 m-0 p-0 list-none mb-8">
        <li className="flex items-start gap-3 text-[0.92rem] text-[var(--ink-muted)]">
          <span className="shrink-0 w-7 h-7 rounded-lg bg-seateal/15 border border-seateal/25 grid place-items-center text-seateal text-[0.85rem]">
            ✦
          </span>
          <span>Verse selected for your specific situation</span>
        </li>
        <li className="flex items-start gap-3 text-[0.92rem] text-[var(--ink-muted)]">
          <span className="shrink-0 w-7 h-7 rounded-lg bg-seateal/15 border border-seateal/25 grid place-items-center text-seateal text-[0.85rem]">
            ◎
          </span>
          <span>Clear interpretation in everyday language</span>
        </li>
        <li className="flex items-start gap-3 text-[0.92rem] text-[var(--ink-muted)]">
          <span className="shrink-0 w-7 h-7 rounded-lg bg-seateal/15 border border-seateal/25 grid place-items-center text-seateal text-[0.85rem]">
            →
          </span>
          <span>Actionable guidance and a written prayer</span>
        </li>
      </ul>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="button"
          onClick={onRequestPrayer}
          className="btn-submit"
        >
          Request Prayer
        </button>
        {!isAuthenticated && (
          <Link
            href="/signup"
            className="btn-secondary"
          >
            Create Free Account
          </Link>
        )}
      </div>
    </section>
  );
}
