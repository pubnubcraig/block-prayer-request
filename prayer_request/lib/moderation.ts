import OpenAI from 'openai';

export type ModerationResult = {
  flagged: boolean;
  blocked: boolean;
  categories: string[];
  crisis: boolean;
};

const CLEAR: ModerationResult = {
  flagged: false,
  blocked: false,
  categories: [],
  crisis: false,
};

const CRISIS_PATTERNS = /\b(suicid|kill\s*my\s*self|end\s*my\s*life|want\s*to\s*die|don'?t\s*want\s*to\s*live|self[- ]?harm|hurting\s*my\s*self|cutting\s*my\s*self|take\s*my\s*(own\s*)?life)\b/i;

export function detectCrisisKeywords(text: string): boolean {
  return CRISIS_PATTERNS.test(text);
}

export async function moderateInput(text: string): Promise<ModerationResult> {
  if (process.env.OPENAI_MODERATION_ENABLED === 'false') {
    return { ...CLEAR, crisis: detectCrisisKeywords(text) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { ...CLEAR, crisis: detectCrisisKeywords(text) };

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.moderations.create({ input: text });
    const result = response.results[0];
    if (!result) return { ...CLEAR, crisis: detectCrisisKeywords(text) };

    const flaggedCategories = Object.entries(result.categories)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (flaggedCategories.length > 0) {
      console.log('[moderation] flagged categories:', flaggedCategories.join(', '));
    }

    const crisis =
      result.categories['self-harm'] ||
      result.categories['self-harm/intent'] ||
      detectCrisisKeywords(text);

    const blocked = result.categories['sexual/minors'] === true;

    return {
      flagged: result.flagged,
      blocked,
      categories: flaggedCategories,
      crisis,
    };
  } catch (err) {
    console.error('[moderation] API error, falling back to keyword detection:', err instanceof Error ? err.message : err);
    return { ...CLEAR, crisis: detectCrisisKeywords(text) };
  }
}
