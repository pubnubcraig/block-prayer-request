'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type PrayerResult = {
  bible_verse: string;
  verse_link: string;
  verse_content: string;
  verse_interpretation: string;
  advice: string;
  prayer: string;
  verse_copyright?: string;
  crisis_resources?: boolean;
};

function escapeHtml(str: string) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function PrayerCounter({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div className="prayer-counter">
      <span className="font-serif font-bold text-[2rem] tracking-tight text-coral leading-none">
        {count.toLocaleString('en-US')}
      </span>
      <span className="text-[0.85rem] font-semibold tracking-[0.04em] uppercase text-[var(--ink-muted)]">
        prayers served
      </span>
    </div>
  );
}

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

export default function HomePage() {
  const [prayerCount, setPrayerCount] = useState(0);
  const [text, setText] = useState('');
  const [bibleVersion, setBibleVersion] = useState('ESV');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [result, setResult] = useState<PrayerResult | null>(null);
  const [showCrisis, setShowCrisis] = useState(false);
  const [theme, setTheme] = useState<ThemeId>('dark');

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => setPrayerCount(data.prayers_served || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setStatus('Please enter your prayer request.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setResult(null);
    setShowCrisis(false);
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

      setResult(data);
      setPrayerCount((c) => c + 1);
      setStatus('Response ready.');
      setIsError(false);

      if (data.crisis_resources) {
        setShowCrisis(true);
      }

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
    <div className="max-w-[1180px] mx-auto px-5 pt-5 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 pb-7 max-[520px]:flex-col max-[520px]:items-start">
        <Link href="/" className="no-underline">
          <Image
            src="/gofish-logo-white-bg.png"
            alt="GoFish - Cast Your Faith"
            width={485}
            height={165}
            className="h-[66px] w-auto"
            priority
          />
        </Link>
        <ThemeToggle active={theme} onChange={setTheme} />
      </header>

      <main>
        <PrayerCounter count={prayerCount} />

        {/* Hero + Form */}
        <section className="grid grid-cols-[1fr_1.05fr] gap-6 items-stretch max-[900px]:grid-cols-1">
          <div className="py-6 pr-2 flex flex-col justify-center max-[900px]:py-2 max-[900px]:pr-0">
            <p className="inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.06em] uppercase text-coral mb-4 before:content-[''] before:w-7 before:h-0.5 before:bg-gradient-to-r before:from-coral before:to-seafoam before:rounded">
              A moment with God
            </p>
            <h1 className="font-serif font-semibold text-[clamp(2.25rem,4.5vw,3.35rem)] leading-[1.08] tracking-tight m-0 mb-4">
              Bring your concern.
              <br />
              <em className="italic text-coral">Receive hope.</em>
            </h1>
            <p className="text-[1.05rem] text-[var(--ink-muted)] max-w-[34rem] mb-7">
              Share what&apos;s on your heart and receive a relevant Bible verse,
              faithful interpretation, practical next steps, and a short prayer
              grounded in Scripture.
            </p>
            <ul className="grid gap-3 m-0 p-0 list-none">
              <li className="flex items-start gap-3 text-[0.92rem] text-[var(--ink-muted)]">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-seateal/15 border border-seateal/25 grid place-items-center text-seateal text-[0.85rem]">
                  ✦
                </span>
                <span>Verse selected for your specific situation</span>
              </li>
              <li className="flex items-start gap-3 text-[0.92rem] text-[var(--ink-muted)]">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-seateal/15 border border-seateal/25 grid place-items-center text-seateal text-[0.85rem]">
                  ◎
                </span>
                <span>Clear interpretation in everyday language</span>
              </li>
              <li className="flex items-start gap-3 text-[0.92rem] text-[var(--ink-muted)]">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-seateal/15 border border-seateal/25 grid place-items-center text-seateal text-[0.85rem]">
                  →
                </span>
                <span>Actionable guidance and a written prayer</span>
              </li>
            </ul>
          </div>

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

            <div className="mb-4">
              <label
                htmlFor="bible_version"
                className="block font-semibold text-[0.82rem] tracking-wide uppercase text-seateal mb-2"
              >
                Bible version
              </label>
              <select
                id="bible_version"
                name="bible_version"
                value={bibleVersion}
                onChange={(e) => setBibleVersion(e.target.value)}
              >
                <option value="ESV">ESV</option>
                <option value="NIV">NIV</option>
                <option value="KJV">KJV</option>
                <option value="NKJV">NKJV</option>
                <option value="NLT">NLT</option>
                <option value="NASB">NASB</option>
                <option value="CSB">CSB</option>
                <option value="NRSV">NRSV</option>
                <option value="MSG">MSG</option>
                <option value="AMP">AMP</option>
              </select>
            </div>

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
          </form>
        </section>

        {/* Crisis Banner */}
        {showCrisis && (
          <aside
            id="crisis-banner"
            className="mt-8 rounded-xl border-2 border-[#ffd59e]/40 bg-[#2a1a0e] p-6 sm:p-8"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0" aria-hidden="true">
                &#x1F9E1;
              </span>
              <div>
                <h3 className="font-serif text-[1.35rem] font-semibold mb-2 text-[#ffd59e]">
                  You are not alone, and you matter deeply.
                </h3>
                <p className="mb-4 text-[0.95rem] text-[#e8d5c0] leading-relaxed">
                  We hear you. If you or someone you know is in crisis or having
                  thoughts of self-harm, please reach out to one of these free,
                  confidential resources:
                </p>
                <ul className="list-none m-0 mb-4 p-0 grid gap-3">
                  <li className="flex items-center gap-3 rounded-lg bg-[#3a2515] px-4 py-3">
                    <span className="text-xl" aria-hidden="true">&#x1F4DE;</span>
                    <div>
                      <strong className="text-[#ffd59e] text-[0.95rem]">
                        988 Suicide &amp; Crisis Lifeline
                      </strong>
                      <span className="block text-[0.88rem] text-[#e8d5c0]">
                        Call or text <strong>988</strong> &mdash; available 24/7
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 rounded-lg bg-[#3a2515] px-4 py-3">
                    <span className="text-xl" aria-hidden="true">&#x1F4AC;</span>
                    <div>
                      <strong className="text-[#ffd59e] text-[0.95rem]">
                        Crisis Text Line
                      </strong>
                      <span className="block text-[0.88rem] text-[#e8d5c0]">
                        Text <strong>HOME</strong> to <strong>741741</strong>
                      </span>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 rounded-lg bg-[#3a2515] px-4 py-3">
                    <span className="text-xl" aria-hidden="true">&#x1F6A8;</span>
                    <div>
                      <strong className="text-[#ffd59e] text-[0.95rem]">
                        Emergency Services
                      </strong>
                      <span className="block text-[0.88rem] text-[#e8d5c0]">
                        Call <strong>911</strong> if you are in immediate danger
                      </span>
                    </div>
                  </li>
                </ul>
                <p className="text-[0.82rem] text-[#b8a090] leading-relaxed">
                  This tool provides Scripture-based encouragement and is not a
                  substitute for professional mental health care. A trained
                  counselor can provide the support you deserve.
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* Results */}
        {result && (
          <section id="results" className="mt-8" aria-live="polite">
            <div className="flex items-end justify-between gap-4 mb-4">
              <h2 className="font-serif text-[1.65rem] m-0 tracking-tight">
                Your response
              </h2>
              <p className="m-0 text-[0.88rem] text-[var(--ink-subtle)]">
                Generated from Scripture and pastoral care principles
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
              {/* Scripture card */}
              <article className="card col-span-2 max-[900px]:col-span-1">
                <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
                  Scripture
                </div>
                <p className="font-serif font-semibold text-[1.35rem] mb-3">
                  <a
                    href={escapeHtml(result.verse_link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-seateal no-underline border-b border-seateal/35 hover:text-oceanblue hover:border-oceanblue transition-colors"
                  >
                    {result.bible_verse}
                  </a>
                </p>
                <blockquote className="verse-text">
                  {result.verse_content}
                </blockquote>
                {result.verse_copyright?.trim() && (
                  <p className="mt-4 text-[0.78rem] leading-snug text-[var(--ink-subtle)]">
                    {result.verse_copyright}
                  </p>
                )}
              </article>

              {/* Interpretation card */}
              <article className="card">
                <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
                  Interpretation
                </div>
                <div className="whitespace-pre-wrap text-[var(--ink-muted)] text-[0.96rem]">
                  {result.verse_interpretation}
                </div>
              </article>

              {/* Guidance card */}
              <article className="card">
                <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
                  Practical guidance
                </div>
                <div className="whitespace-pre-wrap text-[var(--ink-muted)] text-[0.96rem]">
                  {result.advice}
                </div>
              </article>

              {/* Prayer card */}
              <article className="card card-prayer col-span-2 max-[900px]:col-span-1">
                <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue">
                  Prayer
                </div>
                <div className="whitespace-pre-wrap text-[var(--ink)] text-base">
                  {result.prayer}
                </div>
              </article>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-10 pt-6 border-t border-[var(--border)] text-[0.82rem] text-[var(--ink-subtle)]">
        <div className="grid gap-4 max-w-[42rem] mx-auto">
          <div>
            <p className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-1">
              Scripture
            </p>
            <p className="m-0 leading-relaxed">
              Bible text and verse links are provided through the{' '}
              <a
                href="https://platform.youversion.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
              >
                YouVersion Platform
              </a>{' '}
              SDK (
              <code className="font-mono text-[0.88em] text-seateal">
                @youversion/platform-core
              </code>
              ). Translation copyright notices appear with each response when
              supplied by YouVersion. Read passages on{' '}
              <a
                href="https://www.bible.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
              >
                Bible.com
              </a>
              .
            </p>
          </div>
        </div>
        <p className="text-center mt-5 text-[0.8rem]">
          Responses are generated with care and are not a substitute for pastoral
          care or professional help.
        </p>
        <div className="flex justify-center gap-4 mt-3 text-[0.78rem]">
          <Link
            href="/transparency"
            className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
          >
            Transparency
          </Link>
          <Link
            href="/privacy"
            className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
