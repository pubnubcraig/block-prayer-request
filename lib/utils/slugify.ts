/**
 * Convert a topic name to a URL-safe slug.
 * e.g. "Calm in the Storm" → "calm-in-the-storm"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert a slug back to a display-friendly title.
 * e.g. "calm-in-the-storm" → "Calm In The Storm"
 *
 * Note: This is a rough inverse. For exact topic names, look up from the database.
 */
export function deslugify(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
