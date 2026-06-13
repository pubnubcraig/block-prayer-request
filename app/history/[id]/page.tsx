'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import JournalSection from '@/components/prayer-journal/journal-section';
import HistorySharePrompt from '@/components/prayer-wall/history-share-prompt';

type HistoryEntry = {
  id: string;
  requestText: string | null;
  bibleVerse: string | null;
  verseContent: string | null;
  interpretation: string | null;
  advice: string | null;
  prayer: string | null;
  bibleVersionUsed: string | null;
  status: string | null;
  createdAt: string;
};

const sectionBadge =
  'inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal mb-3 before:content-[\'\'] before:w-1.5 before:h-1.5 before:rounded-full before:bg-oceanblue';

function formatFullDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/history/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        setEntry(data.entry);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this prayer from your history?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/history');
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-[720px] mx-auto px-5 pt-12 pb-16 text-center">
        <span className="spinner" />
      </div>
    );
  }

  if (notFound || !entry) {
    return (
      <div className="max-w-[720px] mx-auto px-5 pt-8 pb-16">
        <SiteHeader />
        <h1 className="font-serif font-semibold text-3xl mt-6 mb-2 tracking-tight">
          Prayer not found
        </h1>
        <p className="text-[var(--ink-muted)] text-[0.95rem]">
          This prayer may have been deleted or does not exist.
        </p>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto px-5 pt-8 pb-16">
      <SiteHeader />

      {/* Header */}
      <div className="flex items-end justify-between gap-4 mt-6 mb-6">
        <div className="flex items-center gap-3">
          <p className="text-[var(--ink-subtle)] text-[0.88rem] m-0">
            {formatFullDate(entry.createdAt)}
          </p>
          {entry.status === 'answered' && (
            <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-coral before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-coral">
              Answered
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {entry.requestText && entry.bibleVerse && entry.verseContent && entry.prayer && (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="text-seateal hover:text-oceanblue bg-transparent border-none cursor-pointer text-[0.82rem] font-[inherit] transition-colors"
            >
              Share to Prayer Wall
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-coral/60 hover:text-coral bg-transparent border-none cursor-pointer text-[0.82rem] font-[inherit] disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting\u2026' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Original request */}
      {entry.requestText && (
        <div className="card mb-6">
          <div className={sectionBadge}>Your request</div>
          <p className="whitespace-pre-wrap text-[var(--ink-muted)] text-[0.96rem] m-0">
            {entry.requestText}
          </p>
        </div>
      )}

      {/* Response cards */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <h2 className="font-serif text-[1.65rem] m-0 tracking-tight">
          Your response
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        {/* Scripture card */}
        <article className="card col-span-2 max-[900px]:col-span-1">
          <div className={sectionBadge}>Scripture</div>
          <p className="font-serif font-semibold text-[1.35rem] mb-3">
            <span className="text-seateal">{entry.bibleVerse}</span>
            {entry.bibleVersionUsed && (
              <span className="text-[0.78rem] font-sans font-normal text-[var(--ink-subtle)] ml-2">
                ({entry.bibleVersionUsed})
              </span>
            )}
          </p>
          {entry.verseContent && (
            <blockquote className="verse-text">{entry.verseContent}</blockquote>
          )}
        </article>

        {/* Interpretation card */}
        {entry.interpretation && (
          <article className="card">
            <div className={sectionBadge}>Interpretation</div>
            <div className="whitespace-pre-wrap text-[var(--ink-muted)] text-[0.96rem]">
              {entry.interpretation}
            </div>
          </article>
        )}

        {/* Guidance card */}
        {entry.advice && (
          <article className="card">
            <div className={sectionBadge}>Practical guidance</div>
            <div className="whitespace-pre-wrap text-[var(--ink-muted)] text-[0.96rem]">
              {entry.advice}
            </div>
          </article>
        )}

        {/* Prayer card */}
        {entry.prayer && (
          <article className="card card-prayer col-span-2 max-[900px]:col-span-1">
            <div className={sectionBadge}>Prayer</div>
            <div className="whitespace-pre-wrap text-[var(--ink)] text-base">
              {entry.prayer}
            </div>
          </article>
        )}
      </div>

      <HistorySharePrompt
        entry={entry}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      <JournalSection
        prayerId={entry.id}
        prayerStatus={entry.status}
        onStatusChange={(status) =>
          setEntry((prev) => (prev ? { ...prev, status } : prev))
        }
      />

      <SiteFooter />
    </div>
  );
}
