import Link from 'next/link';

export const metadata = {
  title: 'Prayer History — GoFish',
  description: 'View your saved prayer requests and responses.',
};

export default function HistoryPage() {
  return (
    <div className="max-w-[720px] mx-auto px-5 pt-8 pb-16">
      <Link
        href="/"
        className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam hover:border-seafoam transition-colors text-[0.85rem]"
      >
        &larr; Back to GoFish
      </Link>

      <h1 className="font-serif font-semibold text-3xl mt-6 mb-2 tracking-tight">
        Prayer History
      </h1>
      <p className="text-[var(--ink-muted)] mb-8 text-[0.95rem]">
        Your saved prayer requests and responses will appear here. This feature
        is coming soon.
      </p>
    </div>
  );
}
