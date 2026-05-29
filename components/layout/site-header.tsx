'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UserMenu from '@/components/auth/user-menu';

type ThemeId = 'dark' | 'light';

function ThemeToggle({ active, onChange }: { active: ThemeId; onChange: (t: ThemeId) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(active === 'dark' ? 'light' : 'dark')}
      title={active === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle"
      aria-label={`Switch to ${active === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className={`theme-toggle-track ${active === 'light' ? 'theme-toggle-light' : ''}`}>
        <span className="theme-toggle-thumb" />
      </span>
      <span className="text-[0.72rem] font-semibold tracking-wide uppercase">
        {active === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}

const navLinkClass =
  'text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors';

export default function SiteHeader() {
  const [theme, setTheme] = useState<ThemeId>('dark');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <header className="flex items-center justify-between gap-4 pb-7 max-[520px]:flex-col max-[520px]:items-start">
      <Link href="/" className="flex items-center gap-3 no-underline">
        {theme === 'light' ? (
          <Image
            src="/gofish-logo-white-bg.png"
            alt="GoFish - Cast Your Faith"
            width={485}
            height={165}
            className="h-[66px] w-auto"
            priority
          />
        ) : (
          <Image
            src="/gofish-logo-dark-bg.png"
            alt="GoFish - Cast Your Faith"
            width={488}
            height={165}
            className="h-[66px] w-auto"
            priority
          />
        )}
      </Link>

      <div className="flex items-center gap-5">
        {/* Desktop nav */}
        <nav className="hidden min-[521px]:flex items-center gap-4 text-[0.85rem]">
          <Link href="/feedback" className={navLinkClass}>
            Feedback
          </Link>
          <Link href="/transparency" className={navLinkClass}>
            Transparency
          </Link>
          <Link href="/privacy" className={navLinkClass}>
            Privacy
          </Link>
          <a href="https://www.facebook.com/gofishlife" target="_blank" rel="noopener noreferrer" className={navLinkClass}>
            Facebook
          </a>
        </nav>

        {/* Mobile hamburger */}
        <div className="relative min-[521px]:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex flex-col justify-center items-center w-9 h-9 gap-[5px] bg-transparent border border-[var(--border)] rounded-[var(--radius-sm)] cursor-pointer"
          >
            <span className={`block w-[18px] h-[2px] bg-[var(--ink-muted)] rounded transition-transform duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block w-[18px] h-[2px] bg-[var(--ink-muted)] rounded transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-[18px] h-[2px] bg-[var(--ink-muted)] rounded transition-transform duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
          {menuOpen && (
            <nav className="absolute right-0 top-11 z-50 card grid gap-2 min-w-[160px] py-3 px-4">
              <Link
                href="/feedback"
                onClick={() => setMenuOpen(false)}
                className={`${navLinkClass} text-[0.88rem] py-1`}
              >
                Feedback
              </Link>
              <Link
                href="/transparency"
                onClick={() => setMenuOpen(false)}
                className={`${navLinkClass} text-[0.88rem] py-1`}
              >
                Transparency
              </Link>
              <Link
                href="/privacy"
                onClick={() => setMenuOpen(false)}
                className={`${navLinkClass} text-[0.88rem] py-1`}
              >
                Privacy
              </Link>
              <a
                href="https://www.facebook.com/gofishlife"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className={`${navLinkClass} text-[0.88rem] py-1`}
              >
                Facebook
              </a>
            </nav>
          )}
        </div>

        <ThemeToggle active={theme} onChange={setTheme} />
        <UserMenu />
      </div>
    </header>
  );
}
