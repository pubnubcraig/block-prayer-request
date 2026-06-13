'use client';

import IPrayedButton from './i-prayed-button';
import ShareButtons from './share-buttons';
import { SharedPrayerDetail } from '@/lib/types';

export default function PrayerDetailClient({
  prayer,
}: {
  prayer: SharedPrayerDetail;
}) {
  const url = `https://gofish.life/prayer-wall/${prayer.slug}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <IPrayedButton slug={prayer.slug} initialCount={prayer.prayedCount} />
      </div>

      <div>
        <p className="text-[0.78rem] font-bold tracking-[0.08em] uppercase text-seateal mb-2">
          Share this prayer
        </p>
        <ShareButtons
          slug={prayer.slug}
          title={prayer.publicTitle}
          summary={prayer.publicSummary}
          url={url}
        />
      </div>
    </div>
  );
}
