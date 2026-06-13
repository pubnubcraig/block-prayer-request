'use client';

import { useState } from 'react';
import PrayerWallCard from './prayer-wall-card';
import { SharedPrayerCard } from '@/lib/types';

export default function PrayerWallList({
  initialItems,
  initialTotal,
}: {
  initialItems: SharedPrayerCard[];
  initialTotal: number;
}) {
  const [items, setItems] = useState<SharedPrayerCard[]>(initialItems);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const hasMore = items.length < total;

  async function loadMore() {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/prayer-wall?page=${nextPage}&limit=12`);
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [...prev, ...data.items]);
        setPage(nextPage);
        setTotal(data.total);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--ink-muted)] text-[1.1rem]">
          No prayers have been shared yet. Be the first to share a prayer request.
        </p>
        <a
          href="/"
          className="inline-block mt-4 btn-submit text-[0.88rem] px-5 py-2.5 no-underline"
        >
          Submit a prayer request
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        {items.map((prayer) => (
          <PrayerWallCard key={prayer.id} prayer={prayer} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="btn-submit text-[0.88rem] px-6 py-2.5"
          >
            {loading ? 'Loading\u2026' : 'Load more prayers'}
          </button>
        </div>
      )}
    </>
  );
}
