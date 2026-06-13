'use client';

import { useState } from 'react';

function trackShare(slug: string, platform: string) {
  fetch(`/api/prayer-wall/${slug}/shared`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform }),
  }).catch(() => {});
}

const btnClass =
  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.82rem] font-medium bg-[var(--surface)] border border-[var(--border)] text-seateal hover:bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] transition-colors cursor-pointer';

export default function ShareButtons({
  slug,
  title,
  summary,
  url,
}: {
  slug: string;
  title: string;
  summary: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareText = `Please pray with me. ${summary}`;

  function handleFacebook() {
    trackShare(slug, 'facebook');
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400',
    );
  }

  function handleTwitter() {
    trackShare(slug, 'twitter');
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Please pray with me. I shared a prayer request on GoFish.Life:')}`,
      '_blank',
      'width=600,height=400',
    );
  }

  function handleEmail() {
    trackShare(slug, 'email');
    window.location.href = `mailto:?subject=${encodeURIComponent('Please pray with me')}&body=${encodeURIComponent(`I shared a prayer request on GoFish.Life and would be grateful for your prayers.\n\nYou can view it here:\n${url}`)}`;
  }

  function handleSMS() {
    trackShare(slug, 'sms');
    window.location.href = `sms:?body=${encodeURIComponent(`Please pray with me. I shared a prayer request here: ${url}`)}`;
  }

  async function handleCopyLink() {
    trackShare(slug, 'copy_link');
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={handleFacebook} className={btnClass}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Facebook
      </button>

      <button type="button" onClick={handleTwitter} className={btnClass}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </button>

      <button type="button" onClick={handleSMS} className={btnClass}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        SMS
      </button>

      <button type="button" onClick={handleEmail} className={btnClass}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        Email
      </button>

      <button type="button" onClick={handleCopyLink} className={btnClass}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
