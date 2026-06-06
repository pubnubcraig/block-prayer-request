'use client';

import Link from 'next/link';

const topics = [
  { label: 'Anxiety', prefill: "I'm feeling anxious and need God's peace." },
  { label: 'Marriage', prefill: 'I need guidance and strength for my marriage.' },
  { label: 'Parenting', prefill: "I'm looking for wisdom as a parent." },
  { label: 'Work & Career', prefill: 'I need direction for my job and career.' },
  { label: 'Grief & Loss', prefill: "I'm grieving a loss and need comfort." },
  { label: 'Health', prefill: "I'm facing health concerns and need hope." },
  { label: 'Finances', prefill: "I'm worried about money and need provision." },
  { label: 'Loneliness', prefill: 'I feel alone and need to know God is near.' },
  { label: 'Forgiveness', prefill: "I'm struggling to forgive and need help letting go." },
  { label: 'Gratitude', prefill: "I want to thank God and reflect on His blessings." },
  { label: 'Fear', prefill: "I'm afraid and need courage from God's Word." },
  { label: 'Purpose', prefill: 'I feel lost and need direction for my life.' },
];

export default function PrayerTopicsSection({
  onTopicSelect,
}: {
  onTopicSelect: (prefill: string) => void;
}) {
  return (
    <section className="py-16">
      <p className="text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-coral mb-2">
        Common prayer topics
      </p>
      <h2 className="font-serif font-semibold text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight m-0 mb-3">
        Not sure what to pray about?
      </h2>
      <p className="text-[0.95rem] text-[var(--ink-muted)] mb-8 max-w-[32rem]">
        Select a topic below to get started. You can always edit the request before submitting.
      </p>

      <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-3 max-[520px]:grid-cols-2">
        {topics.map((topic) => (
          <button
            key={topic.label}
            type="button"
            onClick={() => onTopicSelect(topic.prefill)}
            className="topic-chip"
          >
            {topic.label}
          </button>
        ))}
      </div>

      <p className="mt-6 mb-0 text-[0.9rem]">
        <Link
          href="/prayers"
          className="text-oceanblue hover:text-seateal transition-colors"
        >
          Browse all prayer topics &rarr;
        </Link>
      </p>
    </section>
  );
}
