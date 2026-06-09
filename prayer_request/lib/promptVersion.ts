/**
 * Bump this version whenever prompt_verse_interpretation.md changes materially.
 * Cached interpretations with a different prompt_version are treated as misses,
 * forcing regeneration with the updated prompt.
 */
export const INTERPRETATION_PROMPT_VERSION = '1.0.0';
