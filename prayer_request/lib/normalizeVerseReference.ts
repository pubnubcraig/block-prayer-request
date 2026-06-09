/**
 * Normalize a Bible verse reference for consistent cache keying.
 *
 * Rules:
 * - Lowercase and trim
 * - Collapse multiple spaces to single space
 * - Roman numeral prefixes → digits ("I John" → "1 john")
 * - Ordinal prefixes → digits ("First John" → "1 john")
 * - Remove spaces around dashes in verse ranges ("23:1 - 3" → "23:1-3")
 *
 * Does NOT validate that the reference is a real verse.
 */
export function normalizeVerseReference(ref: string): string {
  let s = ref.trim().toLowerCase().replace(/\s+/g, ' ');

  // Ordinal word prefixes → digits (must come before Roman numeral check)
  const ordinals: [RegExp, string][] = [
    [/^first\s/, '1 '],
    [/^second\s/, '2 '],
    [/^third\s/, '3 '],
  ];
  for (const [pattern, replacement] of ordinals) {
    s = s.replace(pattern, replacement);
  }

  // Roman numeral prefixes → digits
  const romans: [RegExp, string][] = [
    [/^iii\s/, '3 '],
    [/^ii\s/, '2 '],
    [/^i\s/, '1 '],
  ];
  for (const [pattern, replacement] of romans) {
    s = s.replace(pattern, replacement);
  }

  // Remove spaces around dashes in verse ranges
  s = s.replace(/\s*-\s*/g, '-');

  return s;
}
