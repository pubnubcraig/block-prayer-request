import Link from 'next/link';

export default function AccountFeaturesSection({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  return (
    <section className="py-16">
      <div className="panel max-w-[640px] mx-auto text-center">
        <p className="text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-coral mb-2">
          Your prayer history
        </p>
        <h2 className="font-serif font-semibold text-[clamp(1.35rem,2.5vw,1.85rem)] tracking-tight m-0 mb-4">
          Save your prayers and revisit them anytime
        </h2>

        <ul className="list-none m-0 mb-6 p-0 grid gap-3 text-left max-w-[28rem] mx-auto">
          <li className="flex items-start gap-3 text-[0.92rem] text-[var(--ink-muted)]">
            <span className="shrink-0 w-7 h-7 rounded-lg bg-seateal/15 border border-seateal/25 grid place-items-center text-seateal text-[0.85rem]">
              ✦
            </span>
            <span>Save every prayer response to your personal history</span>
          </li>
          <li className="flex items-start gap-3 text-[0.92rem] text-[var(--ink-muted)]">
            <span className="shrink-0 w-7 h-7 rounded-lg bg-seateal/15 border border-seateal/25 grid place-items-center text-seateal text-[0.85rem]">
              ◎
            </span>
            <span>Revisit verses and guidance whenever you need encouragement</span>
          </li>
          <li className="flex items-start gap-3 text-[0.92rem] text-[var(--ink-muted)]">
            <span className="shrink-0 w-7 h-7 rounded-lg bg-seateal/15 border border-seateal/25 grid place-items-center text-seateal text-[0.85rem]">
              →
            </span>
            <span>More features coming soon</span>
          </li>
        </ul>

        {!isAuthenticated && (
          <Link href="/signup" className="btn-secondary inline-block">
            Create your free account
          </Link>
        )}
      </div>
    </section>
  );
}
