'use client';

import { Suspense, useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

const inputClass =
  'w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] placeholder:text-[var(--ink-subtle)]';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified') === 'true';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const errorMessages: Record<string, string> = {
    'invalid-token': 'Invalid verification link. Please request a new one.',
    'token-expired': 'Verification link has expired. Please sign up again.',
    'verification-failed': 'Verification failed. Please try again.',
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password, or email not yet verified.');
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <>
      {verified && (
        <div className="card mb-5 border-seateal/30">
          <p className="text-seateal text-[0.9rem] m-0">
            Email verified successfully. You can now sign in.
          </p>
        </div>
      )}

      {errorParam && errorMessages[errorParam] && (
        <div className="card mb-5 border-coral/30">
          <p className="text-coral text-[0.9rem] m-0">
            {errorMessages[errorParam]}
          </p>
        </div>
      )}

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

        <div>
          <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            autoComplete="current-password"
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
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>

        <div className="flex items-center justify-between text-[0.85rem]">
          <Link
            href="/signup"
            className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
          >
            Create account
          </Link>
          <Link
            href="/forgot-password"
            className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-[440px] mx-auto px-5 pt-12 pb-16">
      <SiteHeader />

      <h1 className="font-serif font-semibold text-3xl mt-6 mb-2 tracking-tight">
        Sign in
      </h1>
      <p className="text-[var(--ink-muted)] mb-6 text-[0.95rem]">
        Welcome back. Sign in to your account.
      </p>

      <Suspense fallback={<div className="text-center py-8"><span className="spinner" /></div>}>
        <LoginForm />
      </Suspense>

      <SiteFooter />
    </div>
  );
}
