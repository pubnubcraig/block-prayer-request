'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function FeedbackPage() {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [issueNumber, setIssueNumber] = useState(0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!category || !subject.trim() || !description.trim()) {
      setStatus('Please fill in all required fields.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setStatus('Submitting...');
    setIsError(false);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          subject: subject.trim(),
          description: description.trim(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          website: website || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || 'Something went wrong. Please try again.');
        setIsError(true);
        return;
      }

      setIssueNumber(data.issueNumber);
      setSubmitted(true);
    } catch {
      setStatus('Network error. Please check your connection and try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[720px] mx-auto px-5 pt-8 pb-16">
      <Link
        href="/"
        className="text-oceanblue no-underline border-b border-oceanblue/35 hover:text-seateal hover:border-seateal transition-colors text-[0.85rem]"
      >
        &larr; Back to GoFish
      </Link>

      <h1 className="font-serif font-semibold text-3xl mt-6 mb-2 tracking-tight">
        Feedback
      </h1>
      <p className="text-[var(--ink-muted)] mb-6 text-[0.95rem]">
        Report a bug, suggest a feature, or share your thoughts.
      </p>

      <div className="card mb-6">
        <p className="text-[var(--ink-muted)] text-[0.88rem] leading-relaxed m-0">
          GoFish is a small project without a dedicated support team. We read
          every submission, but we can&apos;t guarantee individual responses. If
          you include your email, we&apos;ll do our best to follow up. A public
          status page is coming soon.
        </p>
      </div>

      {submitted ? (
        <div className="card">
          <div className="text-center py-6">
            <div className="text-seateal text-4xl mb-4" aria-hidden="true">
              &#10003;
            </div>
            <h2 className="font-serif font-semibold text-xl mb-2">
              Thank you!
            </h2>
            <p className="text-[var(--ink-muted)] text-[0.95rem] mb-1">
              Your feedback has been received{issueNumber > 0 && (
                <> as <strong>#{issueNumber}</strong></>
              )}.
            </p>
            <p className="text-[var(--ink-subtle)] text-[0.85rem] mb-6">
              We&apos;ll review it and take it into consideration.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setCategory('');
                setSubject('');
                setDescription('');
                setName('');
                setEmail('');
                setStatus('');
                setIssueNumber(0);
              }}
              className="btn-submit"
            >
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="card grid gap-5">
            {/* Category */}
            <div>
              <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
                Category <span className="text-coral">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="general">General Feedback</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
                Subject <span className="text-coral">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your feedback"
                maxLength={100}
                required
                className="w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] placeholder:text-[var(--ink-subtle)]"
              />
              <span className="text-[0.72rem] text-[var(--ink-subtle)] mt-1 block">
                {subject.length}/100
              </span>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
                Description <span className="text-coral">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, idea, or feedback in detail"
                maxLength={2000}
                required
              />
              <span className="text-[0.72rem] text-[var(--ink-subtle)] mt-1 block">
                {description.length}/2,000
              </span>
            </div>
          </div>

          {/* Optional contact info */}
          <div className="card grid gap-5">
            <p className="text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-[var(--ink-subtle)] m-0">
              Contact Info (optional)
            </p>

            <div>
              <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] placeholder:text-[var(--ink-subtle)]"
              />
            </div>

            <div>
              <label className="block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] placeholder:text-[var(--ink-subtle)]"
              />
            </div>

            {/* Honeypot — hidden from real users */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>
          </div>

          {status && (
            <p
              className={`text-[0.88rem] m-0 ${isError ? 'text-coral' : 'text-[var(--ink-muted)]'}`}
            >
              {status}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="spinner" />
                Submitting...
              </span>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </form>
      )}

      <footer className="text-center text-[0.8rem] text-[var(--ink-subtle)] mt-10 pt-6 border-t border-[var(--border)]">
        <p>
          Your feedback helps improve GoFish for everyone.
        </p>
      </footer>
    </div>
  );
}
