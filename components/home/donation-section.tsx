export default function DonationSection() {
  return (
    <section className="py-16">
      <div className="panel max-w-[640px] mx-auto text-center">
        <p className="text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-coral mb-2">
          Support the mission
        </p>
        <h2 className="font-serif font-semibold text-[clamp(1.35rem,2.5vw,1.85rem)] tracking-tight m-0 mb-4">
          Help keep GoFish.Life free
        </h2>
        <p className="text-[0.95rem] text-[var(--ink-muted)] leading-relaxed max-w-[28rem] mx-auto mb-6">
          GoFish.Life is a volunteer-run ministry. Every prayer response costs a small
          amount to generate through AI and Bible APIs. Your support helps keep this
          resource available to everyone, free of charge.
        </p>
        <p className="text-[0.88rem] text-[var(--ink-subtle)] italic">
          Donation support coming soon.
        </p>
      </div>
    </section>
  );
}
