import { parseRequest } from './parseRequest.js';
import { selectVerse, generatePastoral, generateAdviceAndPrayer } from './openaiPrayer.js';
import { fetchPassageWithFallback } from './youversionBible.js';
import { buildVerseLink } from './bibleComLink.js';
import { normalizeBibleVersion } from './bibleVersions.js';
import { moderateInput, detectCrisisKeywords } from './moderation.js';
import { getCachedInterpretation, cacheInterpretation } from './verseInterpretationCache.js';

export type PrayerRequestInput = {
  text: string;
  bible_version?: string;
};

export type ModerationInfo = {
  flagged: boolean;
  categories: string[];
  crisis: boolean;
};

export type PrayerRequestResult = {
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
  tokensUsed?: number;
  costCents?: number;
  moderationResult?: ModerationInfo;
};

export type PrayerRequestError = { error: string };

function parsePart(input: PrayerRequestInput) {
  return parseRequest({
    partId: 'request',
    text: JSON.stringify({
      text: input.text,
      bible_version: input.bible_version,
    }),
  });
}

export async function runPrayerCore(
  input: PrayerRequestInput,
  onStatus?: (message: string) => void,
): Promise<PrayerRequestResult | PrayerRequestError> {
  const parsed = parsePart(input);
  if ('error' in parsed) {
    return { error: parsed.error };
  }

  const { text, bible_version: requestedVersion } = parsed;
  const bible_version = normalizeBibleVersion(requestedVersion);

  try {
    // --- Moderation & crisis detection ---
    const moderation = await moderateInput(text);

    if (moderation.blocked) {
      return {
        error:
          "We're unable to process this request. If you need help, please contact a trusted person or call 988.",
      };
    }

    const showCrisisResources =
      moderation.crisis || detectCrisisKeywords(text);

    onStatus?.('Selecting verse…');
    const verseResult = await selectVerse(text, bible_version);
    let totalTokens = verseResult.tokensUsed;

    onStatus?.('Fetching Scripture…');
    const { passage, version } = await fetchPassageWithFallback(
      bible_version,
      verseResult.selection.usfm,
    );

    const bible_verse = verseResult.selection.bible_verse || passage.reference;
    const verse_content = passage.content;
    const verse_link = buildVerseLink(
      version.abbrev,
      verseResult.selection.usfm,
      version.youversionDeepLink,
    );

    if (version.usedFallback) {
      onStatus?.(
        `Requested ${bible_version}; verse text from ${version.abbreviation} (id ${version.id}) due to YouVersion license availability.`,
      );
    }
    if (version.copyright) {
      onStatus?.(
        JSON.stringify({ copyright: version.copyright.slice(0, 200) }),
      );
    }

    // Check interpretation cache
    const cached = await getCachedInterpretation(bible_verse, version.abbrev);

    let verse_interpretation: string;
    let adviceText: string;
    let prayerText: string;
    let pastoralTokens: number;

    if (cached) {
      // Cache HIT: generate only advice + prayer
      onStatus?.('Preparing response (cached verse)…');
      verse_interpretation = cached.interpretation;
      const ap = await generateAdviceAndPrayer({
        text,
        bible_version: version.abbrev,
        bible_verse,
        verse_content,
        verse_interpretation,
      });
      adviceText = ap.result.advice;
      prayerText = ap.result.prayer;
      pastoralTokens = ap.tokensUsed;
    } else {
      // Cache MISS: generate all three
      onStatus?.('Preparing response…');
      const pastoral = await generatePastoral({
        text,
        bible_version: version.abbrev,
        bible_verse,
        verse_content,
      });
      verse_interpretation = pastoral.result.verse_interpretation;
      adviceText = pastoral.result.advice;
      prayerText = pastoral.result.prayer;
      pastoralTokens = pastoral.tokensUsed;

      // Store interpretation for future requests (fire-and-forget)
      cacheInterpretation(
        bible_verse,
        version.abbrev,
        verse_content,
        verse_interpretation,
        process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      ).catch((e) => console.error('[cache] Failed to store interpretation:', e));
    }

    totalTokens += pastoralTokens;

    // GPT-4o-mini blended rate: ~$0.375 per 1M tokens
    const costCents = Math.ceil(totalTokens * 0.0000375);

    const result: PrayerRequestResult = {
      bible_verse,
      verse_link,
      verse_content,
      verse_interpretation,
      advice: adviceText,
      prayer: prayerText,
      bible_version_used: version.abbreviation,
      bible_version_fallback: version.usedFallback,
      ...(version.copyright ? { verse_copyright: version.copyright } : {}),
      ...(showCrisisResources ? { crisis_resources: true } : {}),
      tokensUsed: totalTokens,
      costCents,
      moderationResult: {
        flagged: moderation.flagged,
        categories: moderation.categories,
        crisis: moderation.crisis,
      },
    };

    for (const key of [
      'bible_verse',
      'verse_link',
      'verse_content',
      'verse_interpretation',
      'advice',
      'prayer',
    ] as const) {
      if (!result[key]?.trim()) {
        return { error: `Missing or empty field: ${key}` };
      }
    }

    return result;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[prayer] runPrayerCore error:', message);
    return { error: message };
  }
}
