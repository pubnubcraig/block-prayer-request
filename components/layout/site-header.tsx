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
          <a href="https://www.facebook.com/gofishlife" target="_blank" rel="noopener noreferrer" className="text-oceanblue hover:text-seateal transition-colors" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.instagram.com/gofishlife" target="_blank" rel="noopener noreferrer" className="text-oceanblue hover:text-seateal transition-colors" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
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
              <a
                href="https://www.facebook.com/gofishlife"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="text-oceanblue hover:text-seateal transition-colors flex items-center gap-2 py-1"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a
                href="https://www.instagram.com/gofishlife"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="text-oceanblue hover:text-seateal transition-colors flex items-center gap-2 py-1"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
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
