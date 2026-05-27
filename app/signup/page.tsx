'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

const inputClass =
  'w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] placeholder:text-[var(--ink-subtle)]';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[440px] mx-auto px-5 pt-12 pb-16">
      <Link
        href="/"
        className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors text-[0.85rem]"
      >
        &larr; Back to GoFish
      </Link>

      <h1 className="font-serif font-semibold text-3xl mt-6 mb-2 tracking-tight">
        Create account
      </h1>
      <p className="text-[var(--ink-muted)] mb-6 text-[0.95rem]">
        Sign up to personalize your prayer experience.
      </p>

      {success ? (
        <div className="card">
          <div className="text-center py-6">
            <div className="text-seateal text-4xl mb-4" aria-hidden="true">
              &#9993;
            </div>
            <h2 className="font-serif font-semibold text-xl mb-2">
              Check your email
            </h2>
            <p className="text-[var(--ink-muted)] text-[0.95rem] mb-1">
              We sent a verification link to <strong>{email}</strong>.
            </p>
            <p className="text-[var(--ink-subtle)] text-[0.85rem] mb-6">
              Click the link in the email to activate your account.
            </p>
            <Link
              href="/login"
              className="btn-submit inline-block no-underline"
            >
              Go to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card grid gap-5">
          <div>
            <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
              Name <span className="text-[var(--ink-subtle)] normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
              Email <span className="text-coral">*</span>
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

          <div>
            <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
              Password <span className="text-coral">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
              Confirm password <span className="text-coral">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
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
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>

          <p className="text-center text-[0.85rem] text-[var(--ink-muted)] m-0">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
