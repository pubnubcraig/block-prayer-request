import type { StartTaskMessage, TaskContext, HandlerResult } from '@blocks-network/sdk';
import { parseRequest } from './lib/parseRequest.js';
import { selectVerse, generatePastoral } from './lib/openaiPrayer.js';
import { fetchPassageWithFallback } from './lib/youversionBible.js';
import { buildVerseLink } from './lib/bibleComLink.js';
import { normalizeBibleVersion } from './lib/bibleVersions.js';

function jsonArtifact(payload: Record<string, unknown>): HandlerResult {
  return {
    artifacts: [
      {
        data: JSON.stringify(payload),
        mimeType: 'application/json',
        outputId: 'result',
      },
    ],
  };
}

export default async function handler(
  task: StartTaskMessage,
  ctx?: TaskContext,
): Promise<HandlerResult> {
  const part = ctx?.requestParts?.[0] ?? task.requestParts?.[0];
  const input = parseRequest(part);

  if ('error' in input) {
    return jsonArtifact({ error: input.error });
  }

  const { text, bible_version: requestedVersion } = input;
  const bible_version = normalizeBibleVersion(requestedVersion);

  try {
    ctx?.reportStatus('Selecting verse…');
    const selection = await selectVerse(text, bible_version);

    ctx?.reportStatus('Fetching Scripture…');
    const { passage, version } = await fetchPassageWithFallback(bible_version, selection.usfm);

    const bible_verse = selection.bible_verse || passage.reference;
    const verse_content = passage.content;
    const verse_link = buildVerseLink(
      version.abbrev,
      selection.usfm,
      version.youversionDeepLink,
    );

    if (version.usedFallback) {
      ctx?.reportStatus(
        `Requested ${bible_version}; verse text from ${version.abbreviation} (id ${version.id}) due to YouVersion license availability.`,
      );
    }
    if (version.copyright) {
      ctx?.reportStatus(
        JSON.stringify({ copyright: version.copyright.slice(0, 200) }),
      );
    }

    ctx?.reportStatus('Preparing response…');
    const pastoral = await generatePastoral({
      text,
      bible_version: version.abbrev,
      bible_verse,
      verse_content,
    });

    const result = {
      bible_verse,
      verse_link,
      verse_content,
      verse_interpretation: pastoral.verse_interpretation,
      advice: pastoral.advice,
      prayer: pastoral.prayer,
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
        return jsonArtifact({ error: `Missing or empty field: ${key}` });
      }
    }

    return jsonArtifact(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return jsonArtifact({ error: message });
  }
}
