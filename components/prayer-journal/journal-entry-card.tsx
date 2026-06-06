'use client';

import { useState } from 'react';
import type { JournalEntry } from '@/lib/types';
import JournalEntryForm from './journal-entry-form';

type Props = {
  entry: JournalEntry;
  onUpdate: (entryId: string, text: string) => Promise<void>;
  onDelete: (entryId: string) => Promise<void>;
};

function formatFullDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

const journalBadge =
  'inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal before:content-[\'\'] before:w-1.5 before:h-1.5 before:rounded-full before:bg-seateal';

const answeredBadge =
  'inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-coral before:content-[\'\'] before:w-1.5 before:h-1.5 before:rounded-full before:bg-coral';

export default function JournalEntryCard({ entry, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAnswered = entry.entryType === 'answered';

  async function handleSave(text: string) {
    setSaving(true);
    try {
      await onUpdate(entry.id, text);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this journal entry?')) return;
    setDeleting(true);
    try {
      await onDelete(entry.id);
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <JournalEntryForm
        mode="edit"
        initialText={entry.entryText}
        saving={saving}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      className={`card mb-4 ${isAnswered ? 'border-l-[3px] border-l-coral' : ''}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className={isAnswered ? answeredBadge : journalBadge}>
            {isAnswered ? 'Prayer Answered' : 'Journal Entry'}
          </span>
          <p className="text-[var(--ink-subtle)] text-[0.78rem] mt-1 mb-0">
            {formatFullDate(entry.createdAt)}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-[var(--ink-subtle)] hover:text-seateal bg-transparent border-none cursor-pointer text-[0.82rem] font-[inherit] transition-colors"
          >
            Edit
          </button>
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
      <p className="whitespace-pre-wrap text-[var(--ink-muted)] text-[0.96rem] m-0">
        {entry.entryText}
      </p>
    </div>
  );
}
