'use client';

import Link from 'next/link';
import IPrayedButton from './i-prayed-button';
import LoveButton from './love-button';
import { SharedPrayerCard } from '@/lib/types';

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000,
  );
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function PrayerWallCard({
  prayer,
}: {
  prayer: SharedPrayerCard;
}) {
  const attribution =
    prayer.displayNameType === 'first_name' && prayer.firstName
      ? `${prayer.firstName} asked for prayer`
      : 'Someone asked for prayer';

  return (
    <article className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.78rem] text-[var(--ink-subtle)] m-0">
          {attribution}
        </p>
        <time
          dateTime={prayer.createdAt}
          className="text-[0.72rem] text-[var(--ink-subtle)] whitespace-nowrap shrink-0"
        >
          {timeAgo(prayer.createdAt)}
        </time>
      </div>

      <h3 className="font-serif text-[1.15rem] font-semibold m-0 tracking-tight">
        {prayer.publicTitle}
      </h3>

      <p className="text-[0.92rem] text-[var(--ink-muted)] m-0 leading-relaxed">
        {prayer.publicSummary}
      </p>

      <p className="text-[0.82rem] text-seateal font-medium m-0">
        {prayer.verseReference}
      </p>

      <p className="text-[0.85rem] text-[var(--ink-muted)] m-0 italic leading-relaxed line-clamp-3">
        {prayer.prayerExcerpt}
      </p>

      <div className="flex items-center justify-between gap-3 pt-2 mt-auto border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <IPrayedButton slug={prayer.slug} initialCount={prayer.prayedCount} />
          <LoveButton slug={prayer.slug} />
        </div>

        <Link
          href={`/prayer-wall/${prayer.slug}`}
          className="text-[0.82rem] text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
        >
          View Prayer
        </Link>
      </div>
    </article>
  );
}
