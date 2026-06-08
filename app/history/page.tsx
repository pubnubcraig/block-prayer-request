'use client';

import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

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
  journalCount: number;
  lastJournalAt: string | null;
};

type ViewMode = 'single-line' | 'multi-line' | 'tiles';

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function truncate(str: string | null, max: number): string {
  if (!str) return '';
  return str.length > max ? str.slice(0, max).trimEnd() + '\u2026' : str;
}

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(dateStr);
}

function formatAge(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day';
  if (diffDays < 30) return `${diffDays} days`;
  const months = Math.floor(diffDays / 30);
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'}`;
  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? 'year' : 'years'}`;
}

const VIEW_MODES: { key: ViewMode; label: string }[] = [
  { key: 'single-line', label: 'Compact' },
  { key: 'multi-line', label: 'Expanded' },
  { key: 'tiles', label: 'Tiles' },
];

export default function HistoryPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('history-view') as ViewMode) || 'tiles';
    }
    return 'tiles';
  });
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [plan, setPlan] = useState('free');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'answered'>('all');
  const [journalFilter, setJournalFilter] = useState<'all' | 'has' | 'none'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  }

  const filtersActive = statusFilter !== 'all' || journalFilter !== 'all' || debouncedSearch !== '';

  function clearFilters() {
    setStatusFilter('all');
    setJournalFilter('all');
    setSearchQuery('');
    setDebouncedSearch('');
    setPage(1);
  }

  const fetchHistory = useCallback(async (p: number, status: string, journal: string, q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: '12' });
      if (status !== 'all') params.set('status', status);
      if (journal !== 'all') params.set('journal', journal);
      if (q) params.set('q', q);
      const res = await fetch(`/api/history?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPlan(data.plan ?? 'free');
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(page, statusFilter, journalFilter, debouncedSearch);
  }, [fetchHistory, page, statusFilter, journalFilter, debouncedSearch]);

  function changeView(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem('history-view', mode);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this prayer from your history?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setTotal((t) => t - 1);
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-[960px] mx-auto px-5 pt-8 pb-16">
      <SiteHeader />

      <div className="flex items-end justify-between gap-4 mt-6 mb-6 max-[600px]:flex-col max-[600px]:items-start">
        <h1 className="font-serif font-semibold text-3xl tracking-tight m-0">
          Prayer History
        </h1>

        {/* View mode toggle */}
        {items.length > 0 && (
          <div className="flex rounded-[var(--radius-sm)] border border-[var(--border)] overflow-hidden">
            {VIEW_MODES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => changeView(key)}
                className={`px-3 py-1.5 text-[0.78rem] font-semibold tracking-wide border-none cursor-pointer transition-colors ${
                  viewMode === key
                    ? 'bg-seateal/15 text-seateal'
                    : 'bg-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Status filter */}
        <div className="flex rounded-[var(--radius-sm)] border border-[var(--border)] overflow-hidden">
          {([['all', 'All'], ['active', 'Active'], ['answered', 'Answered']] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => { setStatusFilter(key); setPage(1); }}
              className={`px-3 py-1.5 text-[0.78rem] font-semibold tracking-wide border-none cursor-pointer transition-colors ${
                statusFilter === key
                  ? 'bg-seateal/15 text-seateal'
                  : 'bg-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Journal filter */}
        <div className="flex rounded-[var(--radius-sm)] border border-[var(--border)] overflow-hidden">
          {([['all', 'All'], ['has', 'Has journal'], ['none', 'No journal']] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => { setJournalFilter(key); setPage(1); }}
              className={`px-3 py-1.5 text-[0.78rem] font-semibold tracking-wide border-none cursor-pointer transition-colors ${
                journalFilter === key
                  ? 'bg-seateal/15 text-seateal'
                  : 'bg-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search prayers…"
          className="px-3 py-1.5 text-[0.85rem] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-subtle)] outline-none focus:border-seateal transition-colors w-[200px] max-[600px]:w-full"
        />

        {/* Clear filters */}
        {filtersActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[0.78rem] text-oceanblue hover:text-seateal bg-transparent border-none cursor-pointer font-[inherit] transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <span className="spinner" />
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="card text-center py-12 px-6">
          {filtersActive ? (
            <>
              <p className="text-[var(--ink-muted)] text-[0.95rem] mb-4">
                No prayers match your filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="text-oceanblue bg-transparent border-none border-b border-oceanblue/35 hover:text-seateal cursor-pointer text-[0.88rem] font-[inherit] transition-colors"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <p className="text-[var(--ink-muted)] text-[0.95rem] mb-4">
                No prayer history yet. Your saved prayer responses will appear here.
              </p>
              <Link
                href="/"
                className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors text-[0.88rem]"
              >
                Submit a prayer request
              </Link>
            </>
          )}
        </div>
      )}

      {/* Single-line table */}
      {!loading && items.length > 0 && viewMode === 'single-line' && (
        <div className="overflow-x-auto">
          <table className="w-full text-[0.88rem] border-collapse">
            <thead>
              <tr className="text-left">
                <th className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal pb-3 pr-4">
                  Date
                </th>
                <th className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal pb-3 pr-4">
                  Request
                </th>
                <th className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal pb-3 pr-4">
                  Verse
                </th>
                <th className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal pb-3 pr-4">
                  Journal
                </th>
                <th className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal pb-3 w-[80px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
                >
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--ink-subtle)]">
                    <span>{formatDate(item.createdAt)}</span>
                    <span className="ml-1 text-[0.7rem] text-[var(--ink-subtle)]/60">
                      ({formatAge(item.createdAt)})
                    </span>
                    {item.status === 'answered' && (
                      <span className="ml-2 inline-flex items-center gap-0.5 text-[0.68rem] font-bold tracking-[0.06em] uppercase text-coral">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" /></svg>
                        Answered
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-[var(--ink-muted)] max-w-[300px] truncate">
                    {truncate(item.requestText, 60)}
                  </td>
                  <td className="py-3 pr-4 text-seateal font-semibold whitespace-nowrap">
                    {item.bibleVerse}
                  </td>
                  <td className="py-3 pr-4 text-[var(--ink-muted)] whitespace-nowrap text-[0.82rem]">
                    {item.journalCount > 0 ? (
                      <span>
                        {item.journalCount} {item.journalCount === 1 ? 'entry' : 'entries'}
                        <span className="text-[var(--ink-subtle)] ml-1">
                          ({formatRelativeDate(item.lastJournalAt)})
                        </span>
                      </span>
                    ) : (
                      <span className="text-[var(--ink-subtle)]">&mdash;</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/history/${item.id}`}
                        className="text-oceanblue no-underline hover:text-seateal transition-colors text-[0.82rem]"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="text-coral/60 hover:text-coral bg-transparent border-none cursor-pointer text-[0.82rem] font-[inherit] disabled:opacity-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Multi-line table */}
      {!loading && items.length > 0 && viewMode === 'multi-line' && (
        <div className="overflow-x-auto">
          <table className="w-full text-[0.88rem] border-collapse">
            <thead>
              <tr className="text-left">
                <th className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal pb-3 pr-4">
                  Date
                </th>
                <th className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal pb-3 pr-4">
                  Verse
                </th>
                <th className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal pb-3 pr-4">
                  Version
                </th>
                <th className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal pb-3 pr-4">
                  Journal
                </th>
                <th className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal pb-3 w-[80px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <Fragment key={item.id}>
                  <tr>
                    <td className="pt-3 pr-4 whitespace-nowrap text-[var(--ink-subtle)] border-t border-[var(--border)]">
                      <span>{formatDate(item.createdAt)}</span>
                      <span className="ml-1 text-[0.7rem] text-[var(--ink-subtle)]/60">
                        ({formatAge(item.createdAt)})
                      </span>
                      {item.status === 'answered' && (
                        <span className="ml-2 inline-flex items-center gap-0.5 text-[0.68rem] font-bold tracking-[0.06em] uppercase text-coral">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" /></svg>
                          Answered
                        </span>
                      )}
                    </td>
                    <td className="pt-3 pr-4 text-seateal font-semibold whitespace-nowrap border-t border-[var(--border)]">
                      {item.bibleVerse}
                    </td>
                    <td className="pt-3 pr-4 text-[var(--ink-subtle)] border-t border-[var(--border)]">
                      {item.bibleVersionUsed}
                    </td>
                    <td className="pt-3 pr-4 text-[var(--ink-muted)] whitespace-nowrap border-t border-[var(--border)] text-[0.82rem]">
                      {item.journalCount > 0 ? (
                        <span>{item.journalCount} {item.journalCount === 1 ? 'entry' : 'entries'}</span>
                      ) : (
                        <span className="text-[var(--ink-subtle)]">&mdash;</span>
                      )}
                    </td>
                    <td className="pt-3 border-t border-[var(--border)]">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/history/${item.id}`}
                          className="text-oceanblue no-underline hover:text-seateal transition-colors text-[0.82rem]"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-coral/60 hover:text-coral bg-transparent border-none cursor-pointer text-[0.82rem] font-[inherit] disabled:opacity-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={5}
                      className="pb-4 pt-2 text-[0.82rem] text-[var(--ink-muted)] leading-relaxed"
                    >
                      <span className="text-[var(--ink-subtle)] font-semibold text-[0.72rem] uppercase tracking-wide">
                        Request:
                      </span>{' '}
                      {truncate(item.requestText, 150)}
                      {item.prayer && (
                        <>
                          <br />
                          <span className="text-[var(--ink-subtle)] font-semibold text-[0.72rem] uppercase tracking-wide">
                            Prayer:
                          </span>{' '}
                          {truncate(item.prayer, 100)}
                        </>
                      )}
                      {item.journalCount > 0 && item.lastJournalAt && (
                        <>
                          <br />
                          <span className="text-[var(--ink-subtle)] font-semibold text-[0.72rem] uppercase tracking-wide">
                            Last journal:
                          </span>{' '}
                          {formatRelativeDate(item.lastJournalAt)}
                        </>
                      )}
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tiles/cards view */}
      {!loading && items.length > 0 && viewMode === 'tiles' && (
        <div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
          {items.map((item) => (
            <article key={item.id} className="card flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="font-serif font-semibold text-seateal text-[1.05rem] m-0 leading-tight">
                  {item.bibleVerse}
                </p>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[0.72rem] text-[var(--ink-subtle)] whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </span>
                  {item.status === 'answered' && (
                    <span className="inline-flex items-center gap-0.5 text-[0.68rem] font-bold tracking-[0.06em] uppercase text-coral">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" /></svg>
                      Answered
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[var(--ink-muted)] text-[0.88rem] m-0 mb-3 flex-1">
                {truncate(item.requestText, 120)}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-[var(--ink-subtle)] mb-3">
                <span>{formatAge(item.createdAt)} old</span>
                {item.journalCount > 0 ? (
                  <>
                    <span>&middot;</span>
                    <span>{item.journalCount} journal {item.journalCount === 1 ? 'entry' : 'entries'}</span>
                    {item.lastJournalAt && (
                      <>
                        <span>&middot;</span>
                        <span>Last activity {formatRelativeDate(item.lastJournalAt)}</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span>&middot;</span>
                    <span>No journal entries</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-[var(--border)]">
                <Link
                  href={`/history/${item.id}`}
                  className="text-oceanblue no-underline hover:text-seateal transition-colors text-[0.82rem] font-semibold"
                >
                  View details
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="text-coral/60 hover:text-coral bg-transparent border-none cursor-pointer text-[0.82rem] font-[inherit] disabled:opacity-50 transition-colors ml-auto"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-oceanblue bg-transparent border-none cursor-pointer text-[0.88rem] font-[inherit] disabled:opacity-40 disabled:cursor-default hover:text-seateal transition-colors"
          >
            &larr; Previous
          </button>
          <span className="text-[0.82rem] text-[var(--ink-subtle)]">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-oceanblue bg-transparent border-none cursor-pointer text-[0.88rem] font-[inherit] disabled:opacity-40 disabled:cursor-default hover:text-seateal transition-colors"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {/* Free tier notice */}
      {!loading && items.length > 0 && plan === 'free' && (
        <div className="mt-8 border-l-2 border-seateal/40 pl-4 py-2">
          <p className="text-[0.82rem] text-[var(--ink-subtle)] m-0">
            Free accounts show your 12 most recent prayers. Upgrade to a paid
            plan for unlimited history.
          </p>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
