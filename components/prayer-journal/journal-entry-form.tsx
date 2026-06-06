'use client';

import { useState, type FormEvent } from 'react';

type Props = {
  mode: 'create' | 'edit' | 'answered';
  initialText?: string;
  saving?: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
};

const inputClass =
  'w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] resize-y min-h-[120px]';

export default function JournalEntryForm({
  mode,
  initialText = '',
  saving = false,
  onSave,
  onCancel,
}: Props) {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please enter your journal entry.');
      return;
    }
    setError('');
    onSave(trimmed);
  }

  const heading =
    mode === 'answered'
      ? 'Mark as Answered'
      : mode === 'edit'
        ? 'Edit Journal Entry'
        : 'Add Journal Entry';

  const placeholder =
    mode === 'answered'
      ? 'Share how this prayer was answered...'
      : 'Write an update, reflection, answered prayer, or what God is teaching you...';

  return (
    <form onSubmit={handleSubmit} className="card mb-4">
      <h3 className="font-serif font-semibold text-[1.1rem] mb-3 tracking-tight">
        {heading}
      </h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
        disabled={saving}
      />
      {error && (
        <p className="text-[#ff9a88] text-[0.82rem] mt-1.5 mb-0">{error}</p>
      )}
      <div className="flex gap-3 mt-3">
        <button
          type="submit"
          disabled={saving}
          className="btn-submit text-[0.88rem] px-5 py-2 disabled:opacity-50"
        >
          {saving ? 'Saving\u2026' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="btn-secondary text-[0.88rem] px-5 py-2 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
