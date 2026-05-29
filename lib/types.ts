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
};

export function escapeHtml(str: string) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
