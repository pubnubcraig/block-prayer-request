'use client';

import { useState, useEffect } from 'react';

export default function IPrayedButton({
  slug,
  initialCount,
}: {
  slug: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [hasPrayed, setHasPrayed] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    try {
      setHasPrayed(localStorage.getItem(`prayed_${slug}`) === 'true');
    } catch {
      // localStorage unavailable
    }
  }, [slug]);

  async function handleClick() {
    if (hasPrayed) return;

    setHasPrayed(true);
    setCount((c) => c + 1);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    try {
      localStorage.setItem(`prayed_${slug}`, 'true');
    } catch {
      // localStorage unavailable
    }

    try {
      const res = await fetch(`/api/prayer-wall/${slug}/prayed`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.prayedCount);
      }
    } catch {
      // Fire-and-forget
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={hasPrayed}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.88rem] font-medium transition-all duration-200 ${
        hasPrayed
          ? 'bg-seateal/15 text-seateal cursor-default'
          : 'bg-seateal/10 text-seateal hover:bg-seateal/20 cursor-pointer'
      } ${animating ? 'scale-110' : ''}`}
    >
      <span className="text-base">{hasPrayed ? '\u2714' : '\uD83D\uDE4F'}</span>
      <span>
        {hasPrayed ? 'Prayed' : 'I Prayed'}
      </span>
      <span className="text-[0.78rem] opacity-70">
        {count}
      </span>
    </button>
  );
}
