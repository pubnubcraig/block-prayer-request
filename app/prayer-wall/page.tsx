import Link from 'next/link';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import PrayerWallList from '@/components/prayer-wall/prayer-wall-list';
import { listSharedPrayers } from '@/lib/prayer-wall/queries';

export const dynamic = 'force-dynamic';

export default async function PrayerWallPage() {
  let items: Awaited<ReturnType<typeof listSharedPrayers>>['items'] = [];
  let total = 0;
  try {
    const result = await listSharedPrayers(1, 12);
    items = result.items;
    total = result.total;
  } catch {
    // Table may not exist yet
  }

  return (
    <div className="max-w-[1180px] mx-auto px-5 pt-5 pb-12">
      <SiteHeader />

      <main>
        <div className="mb-8">
          <h1 className="font-serif text-[2rem] tracking-tight mb-2">
            Prayer Share Wall
          </h1>
          <p className="text-[var(--ink-muted)] text-[1.05rem] m-0 max-w-[600px]">
            A place to share your prayer and pray for others. Every prayer
            matters.
          </p>
        </div>

        <PrayerWallList initialItems={items} initialTotal={total} />

        <div className="mt-12 pt-8 border-t border-[var(--border)] text-center">
          <h2 className="font-serif text-[1.4rem] mb-3 tracking-tight">
            Need prayer?
          </h2>
          <p className="text-[var(--ink-muted)] text-[0.95rem] mb-4">
            Submit your own prayer request and receive a Scripture-based
            response.
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
