'use client';

import { Suspense, useState, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const inputClass =
  'w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] placeholder:text-[var(--ink-subtle)]';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

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
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="card text-center py-8">
        <p className="text-coral text-[0.95rem] mb-4">
          Invalid reset link. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="btn-submit inline-block no-underline"
        >
          Request new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card">
        <div className="text-center py-6">
          <div className="text-seateal text-4xl mb-4" aria-hidden="true">
            &#10003;
          </div>
          <h2 className="font-serif font-semibold text-xl mb-2">
            Password reset
          </h2>
          <p className="text-[var(--ink-muted)] text-[0.95rem] mb-6">
            Your password has been updated. You can now sign in.
          </p>
          <Link
            href="/login"
            className="btn-submit inline-block no-underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-5">
      <div>
        <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
          New password <span className="text-coral">*</span>
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
            Resetting...
          </span>
        ) : (
          'Reset password'
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="max-w-[440px] mx-auto px-5 pt-12 pb-16">
      <h1 className="font-serif font-semibold text-3xl mt-6 mb-2 tracking-tight">
        Set new password
      </h1>
      <p className="text-[var(--ink-muted)] mb-6 text-[0.95rem]">
        Enter your new password below.
      </p>

      <Suspense fallback={<div className="text-center py-8"><span className="spinner" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
