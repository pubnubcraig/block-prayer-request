const steps = [
  {
    number: '1',
    icon: '✦',
    title: 'Share your concern',
    description:
      "Write what's on your heart \u2014 a worry, a decision, a burden. Be as brief or detailed as you'd like.",
  },
  {
    number: '2',
    icon: '◎',
    title: 'Receive Scripture and guidance',
    description:
      'GoFish.Life finds a Bible verse for your situation, explains it in everyday language, and offers practical next steps.',
  },
  {
    number: '3',
    icon: '→',
    title: 'Pray and reflect',
    description:
      'Read a short prayer grounded in Scripture and carry it with you. Come back whenever you need encouragement.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16">
      <p className="text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-coral mb-2">
        Simple and personal
      </p>
      <h2 className="font-serif font-semibold text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight m-0 mb-8">
        How it works
      </h2>

      <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
        {steps.map((step) => (
          <div key={step.number} className="card">
            <div className="flex items-center gap-3 mb-3">
              <span className="shrink-0 w-8 h-8 rounded-full bg-coral/15 border border-coral/25 grid place-items-center text-coral text-[0.85rem] font-bold">
                {step.number}
              </span>
              <span className="shrink-0 w-7 h-7 rounded-lg bg-seateal/15 border border-seateal/25 grid place-items-center text-seateal text-[0.85rem]">
                {step.icon}
              </span>
            </div>
            <h3 className="text-[1rem] font-bold m-0 mb-2 tracking-tight">
              {step.title}
            </h3>
            <p className="m-0 text-[0.9rem] text-[var(--ink-muted)] leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
