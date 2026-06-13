const PII_PATTERNS: Record<string, RegExp> = {
  'phone number': /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
  'email address': /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
  'social security number': /\b\d{3}-\d{2}-\d{4}\b/,
  'street address':
    /\b\d{1,5}\s+[A-Z][a-z]+\s+(St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Ln|Lane|Rd|Road|Ct|Court|Way|Pl|Place)\b/i,
};

export function detectPII(text: string): {
  found: boolean;
  types: string[];
} {
  const types: string[] = [];
  for (const [label, pattern] of Object.entries(PII_PATTERNS)) {
    if (pattern.test(text)) {
      types.push(label);
    }
  }
  return { found: types.length > 0, types };
}
