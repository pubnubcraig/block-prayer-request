'use client';

import { useState, useEffect } from 'react';

export default function LoveButton({ slug }: { slug: string }) {
  const [loved, setLoved] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    try {
      setLoved(localStorage.getItem(`loved_${slug}`) === 'true');
    } catch {
      // localStorage unavailable
    }
  }, [slug]);

  function handleClick() {
    if (loved) return;

    setLoved(true);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    try {
      localStorage.setItem(`loved_${slug}`, 'true');
    } catch {
      // localStorage unavailable
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loved}
      aria-label={loved ? 'Loved' : 'Love this prayer'}
      className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-[0.92rem] transition-all duration-200 ${
        loved
          ? 'bg-coral/15 text-coral cursor-default'
          : 'bg-coral/10 text-coral/70 hover:bg-coral/20 hover:text-coral cursor-pointer'
      } ${animating ? 'scale-125' : ''}`}
    >
      <span>{loved ? '\u2764\uFE0F' : '\uD83E\uDD0D'}</span>
    </button>
  );
}
