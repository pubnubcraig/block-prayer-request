'use client';

import { useState, useEffect, FormEvent } from 'react';
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

function GoFishLogo() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="w-full h-full">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0D2B45" />
          <stop offset="100%" stopColor="#16A3A6" />
        </linearGradient>
      </defs>
      <path
        d="M32 4C18 4 8 14 8 28c0 10 6 18 16 22l0-8c-6-3-10-9-10-14
          0-10 8-18 18-18 6 0 11 3 14 7l-6 0c-2-2-5-3-8-3-8 0-14 6-14 14
          s6 14 14 14c5 0 10-3 12-7H34v-7h20c0 16-10 26-22 26S6 44 6 28
          C6 12 18 2 32 2c8 0 16 4 20 10l-6 4C43 10 38 6 32 6Z"
        fill="url(#logo-g)"
      />
      <circle cx="28" cy="22" r="2.5" fill="url(#logo-g)" />
      <path
        d="M48 10c-2 4-2 8 0 12 2-4 4-8 2-12Z"
        fill="#16A3A6"
        opacity="0.8"
      />
      <path
        d="M12 52c4-2 8-2 12 0s8 2 12 0 8-2 12 0"
        fill="none"
        stroke="#16A3A6"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M16 57c3-2 6-2 9 0s6 2 9 0 6-2 9 0"
        fill="none"
        stroke="#16A3A6"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}

function PrayerCounter({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div className="prayer-counter">
      <span className="font-serif font-bold text-[2rem] tracking-tight text-coral leading-none">
        {count.toLocaleString('en-US')}
      </span>
      <span className="text-[0.85rem] font-semibold tracking-[0.04em] uppercase text-salt/70">
        prayers served
      </span>
    </div>
  );
}

const THEMES = [
  { id: 'default', label: 'Deep Sea', color: '#0d2b45' },
  { id: 'ember', label: 'Ember', color: '#ff6b4a' },
  { id: 'tide', label: 'Tide', color: '#3ba7e1' },
  { id: 'dusk', label: 'Dusk', color: '#6b4090' },
] as const;

type ThemeId = (typeof THEMES)[number]['id'];

function ThemeToggle({ active, onChange }: { active: ThemeId; onChange: (t: ThemeId) => void }) {
  return (
    <div className="flex items-center gap-1.5 bg-[rgba(255,255,255,0.08)] rounded-full p-1 border border-[var(--border)]">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          title={t.label}
          className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
            active === t.id
              ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.3)]'
              : 'border-transparent opacity-60 hover:opacity-100'
          }`}
          style={{ background: t.color }}
        />
      ))}
    </div>
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
  const [theme, setTheme] = useState<ThemeId>('default');

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => setPrayerCount(data.prayers_served || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'default' ? '' : theme);
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
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-11 h-11 shrink-0">
            <GoFishLogo />
          </div>
          <div>
            <div className="font-bold text-[1.05rem] tracking-tight text-salt">
              GoFish
            </div>
            <div className="text-[0.78rem] text-[var(--ink-subtle)] mt-0.5">
              Cast Your Faith.
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle active={theme} onChange={setTheme} />
          <a
            className="pill"
            href="https://blocks.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by PubNub Blocks.ai
          </a>
        </div>
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
                    className="text-seafoam no-underline border-b border-seafoam/35 hover:text-white hover:border-oceanblue transition-colors"
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
                className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam hover:border-seafoam transition-colors"
              >
                YouVersion Platform
              </a>{' '}
              SDK (
              <code className="font-mono text-[0.88em] text-seafoam">
                @youversion/platform-core
              </code>
              ). Translation copyright notices appear with each response when
              supplied by YouVersion. Read passages on{' '}
              <a
                href="https://www.bible.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam hover:border-seafoam transition-colors"
              >
                Bible.com
              </a>
              .
            </p>
          </div>
          <div>
            <p className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-1">
              Agent infrastructure
            </p>
            <p className="m-0 leading-relaxed">
              This experience is powered by{' '}
              <a
                href="https://blocks.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam hover:border-seafoam transition-colors"
              >
                PubNub Blocks.ai
              </a>
              , connecting prayer responses to the Blocks Network.
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
            className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam hover:border-seafoam transition-colors"
          >
            Transparency
          </Link>
          <Link
            href="/privacy"
            className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seafoam hover:border-seafoam transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
