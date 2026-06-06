'use client';

import { useState, useEffect, useCallback } from 'react';
import type { JournalEntry } from '@/lib/types';
import JournalEntryForm from './journal-entry-form';
import JournalEntryCard from './journal-entry-card';

type Props = {
  prayerId: string;
  prayerStatus: string | null;
  onStatusChange: (status: string) => void;
};

export default function JournalSection({
  prayerId,
  prayerStatus,
  onStatusChange,
}: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAnsweredForm, setShowAnsweredForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAnswered = prayerStatus === 'answered';

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/history/${prayerId}/journal`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [prayerId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleCreate(text: string, type: 'journal' | 'answered') {
    setSaving(true);
    try {
      const res = await fetch(`/api/history/${prayerId}/journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry_text: text, entry_type: type }),
      });
      if (res.ok) {
        const data = await res.json();
        setEntries((prev) => [...prev, data.entry]);
        setShowForm(false);
        setShowAnsweredForm(false);
        if (type === 'answered') {
          onStatusChange('answered');
        }
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(entryId: string, text: string) {
    const res = await fetch(`/api/history/${prayerId}/journal/${entryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_text: text }),
    });
    if (res.ok) {
      const data = await res.json();
      setEntries((prev) =>
        prev.map((e) => (e.id === entryId ? data.entry : e)),
      );
    }
  }

  async function handleDelete(entryId: string) {
    const entry = entries.find((e) => e.id === entryId);
    const res = await fetch(`/api/history/${prayerId}/journal/${entryId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      if (entry?.entryType === 'answered') {
        onStatusChange('active');
      }
    }
  }

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-4 mb-4">
        <h2 className="font-serif text-[1.65rem] m-0 tracking-tight">
          Prayer journal
        </h2>
      </div>

      {/* Action buttons */}
      {!showForm && !showAnsweredForm && (
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setShowAnsweredForm(false);
            }}
            className="btn-secondary text-[0.88rem] px-5 py-2"
          >
            Add Journal Entry
          </button>
          {!isAnswered && (
            <button
              type="button"
              onClick={() => {
                setShowAnsweredForm(true);
                setShowForm(false);
              }}
              className="btn-submit text-[0.88rem] px-5 py-2"
            >
              Mark as Answered
            </button>
          )}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <JournalEntryForm
          mode="create"
          saving={saving}
          onSave={(text) => handleCreate(text, 'journal')}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Answered form */}
      {showAnsweredForm && (
        <JournalEntryForm
          mode="answered"
          saving={saving}
          onSave={(text) => handleCreate(text, 'answered')}
          onCancel={() => setShowAnsweredForm(false)}
        />
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <span className="spinner" />
        </div>
      )}

      {/* Empty state */}
      {!loading && entries.length === 0 && (
        <p className="text-[var(--ink-subtle)] text-[0.92rem] italic">
          No journal entries yet. Add your first reflection and begin tracking
          this prayer journey.
        </p>
      )}

      {/* Journal entries timeline */}
      {!loading &&
        entries.map((entry) => (
          <JournalEntryCard
            key={entry.id}
            entry={entry}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
    </section>
  );
}
