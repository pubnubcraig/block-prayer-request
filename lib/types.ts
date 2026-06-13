export type PrayerResult = {
  bible_verse: string;
  verse_link: string;
  verse_content: string;
  verse_interpretation: string;
  advice: string;
  prayer: string;
  bible_version_used?: string;
  bible_version_fallback?: boolean;
  verse_copyright?: string;
  crisis_resources?: boolean;
  saveStatus?: 'auto-saved' | 'save-available' | 'save-disabled' | 'unauthenticated';
};

export type JournalEntry = {
  id: string;
  prayerId: string;
  userId: string;
  entryText: string;
  entryType: 'journal' | 'answered';
  createdAt: string;
  updatedAt: string;
};

// ── Prayer Share Wall types ─────────────────────────────────────────

export type ShareDisplayNameType = 'anonymous' | 'first_name';

export type SharePrayerPayload = {
  requestText: string;
  bibleVerse: string;
  verseContent: string;
  verseInterpretation: string;
  advice: string;
  prayer: string;
  bibleVersionUsed?: string;
  displayNameType: ShareDisplayNameType;
  firstName?: string;
};

export type SharedPrayerCard = {
  id: string;
  publicTitle: string;
  publicSummary: string;
  verseReference: string;
  prayerExcerpt: string;
  displayNameType: ShareDisplayNameType;
  firstName: string | null;
  slug: string;
  prayedCount: number;
  createdAt: string;
};

export type SharedPrayerDetail = SharedPrayerCard & {
  requestText: string;
  verseText: string;
  fullPrayer: string;
  interpretation: string | null;
  practicalGuidance: string | null;
  shareCount: number;
};

// ── Utilities ───────────────────────────────────────────────────────

export function escapeHtml(str: string) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
