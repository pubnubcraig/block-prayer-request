'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

const inputClass =
  'w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] placeholder:text-[var(--ink-subtle)]';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      await res.json();
      setSent(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[440px] mx-auto px-5 pt-12 pb-16">
      <Link
        href="/login"
        className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors text-[0.85rem]"
      >
        &larr; Back to sign in
      </Link>

      <h1 className="font-serif font-semibold text-3xl mt-6 mb-2 tracking-tight">
        Reset password
      </h1>
      <p className="text-[var(--ink-muted)] mb-6 text-[0.95rem]">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {sent ? (
        <div className="card">
          <div className="text-center py-6">
            <div className="text-seateal text-4xl mb-4" aria-hidden="true">
              &#9993;
            </div>
            <h2 className="font-serif font-semibold text-xl mb-2">
              Check your email
            </h2>
            <p className="text-[var(--ink-muted)] text-[0.95rem] mb-1">
              If an account exists for <strong>{email}</strong>, we sent a
              password reset link.
            </p>
            <p className="text-[var(--ink-subtle)] text-[0.85rem]">
              The link expires in 1 hour.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card grid gap-5">
          <div>
            <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-coral text-[0.88rem] m-0">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-submit w-full">
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="spinner" />
                Sending...
              </span>
            ) : (
              'Send reset link'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
