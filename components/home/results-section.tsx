'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PrayerResult, escapeHtml } from '@/lib/types';
import SharePrompt from './share-prompt';

export default function ResultsSection({
  result,
  requestText,
}: {
  result: PrayerResult | null;
  requestText: string;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!result) return null;

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestText,
          bibleVerse: result!.bible_verse,
          verseContent: result!.verse_content,
          interpretation: result!.verse_interpretation,
          advice: result!.advice,
          prayer: result!.prayer,
          bibleVersionUsed: result!.bible_version_used,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function renderSaveAction() {
    const status = result?.saveStatus;

    if (status === 'auto-saved') {
      return (
        <span className="text-[0.88rem] text-[var(--ink-subtle)] italic">
          Saved to your prayer history
        </span>
      );
    }

    if (status === 'save-available') {
      if (saved) {
        return (
          <span className="text-[0.88rem] text-seateal font-medium">
            Saved to your prayer history
          </span>
        );
      }
      return (
        <>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-submit text-[0.88rem] px-4 py-2"
          >
            {saving ? 'Saving\u2026' : 'Save this prayer'}
          </button>
          {saveError && (
            <span className="text-[0.82rem] text-[#ff9a88]">{saveError}</span>
          )}
        </>
      );
    }

    if (status === 'unauthenticated') {
      return (
        <Link
          href="/login"
          className="text-[0.88rem] text-seateal font-medium hover:underline"
        >
          Sign in to save this prayer
        </Link>
      );
    }

    // 'save-disabled' or undefined: show nothing
    return null;
  }

  const saveAction = renderSaveAction();

  return (
    <>
      <section id="results" className="mt-8" aria-live="polite">
        <div className="flex items-end justify-between gap-4 mb-4 max-[520px]:flex-col max-[520px]:items-start">
          <h2 className="font-serif text-[1.65rem] m-0 tracking-tight">
            Your response
          </h2>
          <p className="m-0 text-[0.88rem] text-[var(--ink-subtle)]">
            Generated from Scripture and pastoral care principles
          </p>
        </div>

        {saveAction && (
          <div className="flex items-center gap-3 mb-4">
            {saveAction}
          </div>
        )}

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
              {result.bible_version_used && (
                <span className="text-[0.78rem] font-sans font-normal text-[var(--ink-subtle)] ml-2">
                  ({result.bible_version_used})
                </span>
              )}
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

      {/* Scripture attribution */}
      <div className="mt-10 pt-6 border-t border-[var(--border)] text-[0.82rem] text-[var(--ink-subtle)]">
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
      </div>

      <SharePrompt result={result} requestText={requestText} />
    </>
  );
}
