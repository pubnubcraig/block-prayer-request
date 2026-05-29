const values = [
  {
    title: 'Scripture-centered',
    description:
      'Every response starts with a real Bible verse from YouVersion, not generic advice.',
  },
  {
    title: 'Private and secure',
    description:
      "Your prayer requests are yours. We don't share, sell, or publicly display them.",
  },
  {
    title: 'Always free',
    description:
      'No paywall. No premium tier. GoFish.Life is a ministry, not a product.',
  },
  {
    title: 'Practical, not preachy',
    description:
      'Receive clear interpretation, actionable guidance, and a prayer you can actually use.',
  },
  {
    title: 'A starting point, not a substitute',
    description:
      'GoFish.Life encourages you to turn to God first \u2014 and to your church, counselor, or doctor when needed.',
  },
];

export default function WhySection() {
  return (
    <section className="py-16">
      <p className="text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-coral mb-2">
        Built with purpose
      </p>
      <h2 className="font-serif font-semibold text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight m-0 mb-8">
        Why GoFish.Life
      </h2>

      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        {values.map((value) => (
          <div key={value.title} className="card">
            <h3 className="text-[1rem] font-bold m-0 mb-2 tracking-tight text-seateal">
              {value.title}
            </h3>
            <p className="m-0 text-[0.9rem] text-[var(--ink-muted)] leading-relaxed">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
