'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  if (status === 'loading') {
    return <div className="w-8 h-8 rounded-full bg-[var(--border)] animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors text-[0.85rem]"
      >
        Sign in
      </Link>
    );
  }

  const initials = (session.user.name || session.user.email || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
        aria-expanded={open}
        className="w-8 h-8 rounded-full bg-seateal/20 border border-seateal/40 text-seateal text-[0.72rem] font-bold tracking-wider flex items-center justify-center cursor-pointer hover:bg-seateal/30 transition-colors"
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 card min-w-[180px] py-2 px-0">
          <div className="px-4 py-2 border-b border-[var(--border)]">
            <p className="text-[0.82rem] font-semibold text-[var(--ink)] m-0 truncate">
              {session.user.name || 'User'}
            </p>
            <p className="text-[0.75rem] text-[var(--ink-subtle)] m-0 truncate">
              {session.user.email}
            </p>
          </div>

          <nav className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-[0.85rem] text-[var(--ink-muted)] no-underline hover:bg-[rgba(59,167,225,0.08)] transition-colors"
            >
              Profile settings
            </Link>
            <Link
              href="/history"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-[0.85rem] text-[var(--ink-muted)] no-underline hover:bg-[rgba(59,167,225,0.08)] transition-colors"
            >
              Prayer history
            </Link>
          </nav>

          <div className="border-t border-[var(--border)] pt-1">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="block w-full text-left px-4 py-2 text-[0.85rem] text-coral bg-transparent border-0 cursor-pointer font-[inherit] hover:bg-[rgba(255,107,107,0.08)] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
