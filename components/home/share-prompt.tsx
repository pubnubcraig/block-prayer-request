'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShareButtons from '@/components/prayer-wall/share-buttons';
import { PrayerResult } from '@/lib/types';

type Step = 'initial' | 'name-input' | 'preview' | 'submitting' | 'success' | 'error';

export default function SharePrompt({
  result,
  requestText,
}: {
  result: PrayerResult;
  requestText: string;
}) {
  const [step, setStep] = useState<Step>('initial');
  const [displayNameType, setDisplayNameType] = useState<'anonymous' | 'first_name'>('anonymous');
  const [firstName, setFirstName] = useState('');
  const [slug, setSlug] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  async function handleSubmit() {
    setStep('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/prayer-wall/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestText,
          bibleVerse: result.bible_verse,
          verseContent: result.verse_content,
          verseInterpretation: result.verse_interpretation,
          advice: result.advice,
          prayer: result.prayer,
          bibleVersionUsed: result.bible_version_used,
          displayNameType,
          firstName: displayNameType === 'first_name' ? firstName : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to share prayer.');
        setStep('error');
        return;
      }

      setSlug(data.slug);
      setStep('success');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStep('error');
    }
  }

  // Initial prompt
  if (step === 'initial') {
    return (
      <div className="card p-5 mt-6">
        <h3 className="font-serif text-[1.15rem] font-semibold m-0 mb-2 tracking-tight">
          Share on the Prayer Share Wall
        </h3>
        <p className="text-[0.92rem] text-[var(--ink-muted)] m-0 mb-4">
          Would you like to share this prayer request so others can pray with
          you?
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setDisplayNameType('anonymous');
              setStep('preview');
            }}
            className="btn-submit text-[0.85rem] px-4 py-2"
          >
            Share anonymously
          </button>
          <button
            type="button"
            onClick={() => {
              setDisplayNameType('first_name');
              setStep('name-input');
            }}
            className="btn-submit text-[0.85rem] px-4 py-2"
          >
            Share with first name
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="px-4 py-2 text-[0.85rem] text-[var(--ink-subtle)] hover:text-[var(--ink-muted)] transition-colors cursor-pointer bg-transparent border-none"
          >
            No thanks
          </button>
        </div>
      </div>
    );
  }

  // Name input
  if (step === 'name-input') {
    return (
      <div className="card p-5 mt-6">
        <h3 className="font-serif text-[1.15rem] font-semibold m-0 mb-2 tracking-tight">
          Your first name
        </h3>
        <p className="text-[0.92rem] text-[var(--ink-muted)] m-0 mb-3">
          Only your first name will be shown. No other personal information is
          shared.
        </p>
        <div className="flex gap-2 items-center mb-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            maxLength={50}
            className="input-field text-[0.92rem] px-3 py-2 flex-1 max-w-[240px]"
          />
          <button
            type="button"
            onClick={() => {
              if (!firstName.trim()) return;
              setStep('preview');
            }}
            disabled={!firstName.trim()}
            className="btn-submit text-[0.85rem] px-4 py-2"
          >
            Continue
          </button>
        </div>
        <button
          type="button"
          onClick={() => setStep('initial')}
          className="text-[0.82rem] text-[var(--ink-subtle)] hover:text-[var(--ink-muted)] transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          &larr; Go back
        </button>
      </div>
    );
  }

  // Preview
  if (step === 'preview') {
    const attribution =
      displayNameType === 'first_name' && firstName
        ? `${firstName} asked for prayer`
        : 'Someone asked for prayer';

    return (
      <div className="card p-5 mt-6">
        <h3 className="font-serif text-[1.15rem] font-semibold m-0 mb-3 tracking-tight">
          Preview your shared prayer
        </h3>

        {/* Preview card */}
        <div className="card p-4 mb-4">
          <p className="text-[0.78rem] text-[var(--ink-subtle)] m-0 mb-1">
            {attribution}
          </p>
          <p className="text-[0.92rem] text-[var(--ink-muted)] m-0 mb-2">
            &ldquo;{requestText.length > 150
              ? requestText.slice(0, 150) + '...'
              : requestText}&rdquo;
          </p>
          <p className="text-[0.82rem] text-seateal font-medium m-0 mb-1">
            {result.bible_verse}
          </p>
          <p className="text-[0.85rem] text-[var(--ink-muted)] m-0 italic">
            {result.prayer.length > 200
              ? result.prayer.slice(0, 200) + '...'
              : result.prayer}
          </p>
        </div>

        {/* Privacy warning */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3 mb-4 text-[0.82rem] text-[var(--ink-muted)]">
          <p className="m-0 mb-1 font-medium text-[var(--ink)]">
            Before sharing
          </p>
          <p className="m-0 mb-2">
            Please do not include private names, phone numbers, addresses, or
            sensitive details in your prayer request.
          </p>
          <p className="m-0 text-[0.78rem] text-[var(--ink-subtle)]">
            By sharing to the Prayer Share Wall, you agree that your prayer
            request may be featured by GoFish.Life on public channels, including
            social media.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-submit text-[0.85rem] px-4 py-2"
          >
            Share prayer
          </button>
          <button
            type="button"
            onClick={() =>
              setStep(displayNameType === 'first_name' ? 'name-input' : 'initial')
            }
            className="px-4 py-2 text-[0.85rem] text-[var(--ink-subtle)] hover:text-[var(--ink-muted)] transition-colors cursor-pointer bg-transparent border-none"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Submitting
  if (step === 'submitting') {
    return (
      <div className="card p-5 mt-6 text-center">
        <div className="spinner mx-auto mb-3" />
        <p className="text-[0.92rem] text-[var(--ink-muted)] m-0">
          Sharing your prayer&hellip;
        </p>
      </div>
    );
  }

  // Success
  if (step === 'success') {
    const url = `https://gofish.life/prayer-wall/${slug}`;

    return (
      <div className="card p-5 mt-6">
        <h3 className="font-serif text-[1.15rem] font-semibold m-0 mb-2 tracking-tight text-seateal">
          Your prayer has been shared
        </h3>
        <p className="text-[0.92rem] text-[var(--ink-muted)] m-0 mb-4">
          Thank you for sharing. Others can now pray with you.
        </p>

        <div className="mb-4">
          <Link
            href={`/prayer-wall/${slug}`}
            className="text-[0.88rem] text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors"
          >
            View on the Prayer Wall &rarr;
          </Link>
        </div>

        <p className="text-[0.78rem] font-bold tracking-[0.08em] uppercase text-seateal mb-2">
          Invite others to pray
        </p>
        <ShareButtons
          slug={slug}
          title="Prayer Request"
          summary="I shared a prayer request on GoFish.Life and would be grateful for your prayers."
          url={url}
        />
      </div>
    );
  }

  // Error
  return (
    <div className="card p-5 mt-6">
      <h3 className="font-serif text-[1.15rem] font-semibold m-0 mb-2 tracking-tight">
        Unable to share
      </h3>
      <p className="text-[0.92rem] text-[#ff9a88] m-0 mb-4">{errorMsg}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStep('preview')}
          className="btn-submit text-[0.85rem] px-4 py-2"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="px-4 py-2 text-[0.85rem] text-[var(--ink-subtle)] hover:text-[var(--ink-muted)] transition-colors cursor-pointer bg-transparent border-none"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
