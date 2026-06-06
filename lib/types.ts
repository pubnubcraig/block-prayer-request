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

export function escapeHtml(str: string) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
