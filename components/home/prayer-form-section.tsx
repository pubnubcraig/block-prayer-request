'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { PrayerResult } from '@/lib/types';

export default function PrayerFormSection({
  prefillText,
  onResult,
  onPrayerCountIncrement,
}: {
  prefillText: string;
  onResult: (result: PrayerResult, isCrisis: boolean) => void;
  onPrayerCountIncrement: () => void;
}) {
  const [text, setText] = useState('');
  const [bibleVersion] = useState('ASV');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (prefillText) {
      setText(prefillText);
    }
  }, [prefillText]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setStatus('Please enter your prayer request.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setStatus('Selecting a verse and preparing your response\u2026');
    setIsError(false);

    try {
      const res = await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, bible_version: bibleVersion }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      onPrayerCountIncrement();
      onResult(data, !!data.crisis_resources);
      setStatus('Response ready.');
      setIsError(false);

      setTimeout(() => {
        const target = data.crisis_resources
          ? document.getElementById('crisis-banner')
          : document.getElementById('results');
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch (err) {
      setStatus(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="prayer-form">
      <form onSubmit={handleSubmit} className="panel" noValidate>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-[1.1rem] font-bold m-0 tracking-tight">
              Your request
            </h2>
            <p className="mt-1 mb-0 text-[0.85rem] text-[var(--ink-subtle)]">
              Be as specific as you feel comfortable sharing.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="text"
            className="block font-semibold text-[0.82rem] tracking-wide uppercase text-seateal mb-2"
          >
            What would you like prayer for?
          </label>
          <textarea
            id="text"
            name="text"
            required
            placeholder="For example: I feel anxious about the future and need peace."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <p className="text-[0.78rem] text-[var(--ink-subtle)] italic mb-4">
          Scripture passages use the American Standard Version (ASV). More version options coming soon.
        </p>

        <div className="flex items-center gap-4 flex-wrap mt-1 max-[520px]:flex-col max-[520px]:items-stretch">
          <button
            type="submit"
            disabled={loading}
            className="btn-submit max-[520px]:w-full max-[520px]:text-center"
          >
            Receive prayer response
          </button>
          <div className="flex items-center gap-2 min-h-6">
            {loading && <span className="spinner" />}
            {status && (
              <span
                className={`text-[0.88rem] ${isError ? 'text-[#ff9a88]' : 'text-[var(--ink-muted)]'}`}
              >
                {status}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-4">
          <p className="mb-0 text-[0.78rem] text-[var(--ink-subtle)] leading-relaxed">
            Your request is processed securely and is not stored unless you have an account.
            If you are in crisis, please call <strong>988</strong> or text <strong>HOME</strong> to <strong>741741</strong>.
          </p>
          <Link
            href="/feedback"
            className="shrink-0 text-[0.78rem] font-medium text-seateal hover:underline"
          >
            Feedback
          </Link>
        </div>
      </form>
    </section>
  );
}
