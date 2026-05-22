import handler from '../handler.js';
import type { HandlerResult, StartTaskMessage } from '@blocks-network/sdk';

export type PrayerRequestInput = {
  text: string;
  bible_version?: string;
};

export type PrayerRequestResult = {
  bible_verse: string;
  verse_link: string;
  verse_content: string;
  verse_interpretation: string;
  advice: string;
  prayer: string;
};

function parseHandlerResult(result: HandlerResult): PrayerRequestResult {
  const artifact = result.artifacts?.[0];
  if (!artifact?.data) {
    throw new Error('No response from prayer handler');
  }

  const raw =
    typeof artifact.data === 'string'
      ? artifact.data
      : new TextDecoder().decode(artifact.data);

  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(raw) as Record<string, string>;
  } catch {
    throw new Error('Invalid JSON from prayer handler');
  }

  if (parsed.error) {
    throw new Error(parsed.error);
  }

  return parsed as PrayerRequestResult;
}

export async function runPrayerRequest(
  input: PrayerRequestInput,
): Promise<PrayerRequestResult> {
  const task: StartTaskMessage = {
    type: 'StartTask',
    taskId: 'vercel-api',
    ownerId: 'vercel-api',
    requestParts: [
      {
        partId: 'request',
        text: JSON.stringify({
          text: input.text,
          bible_version: input.bible_version,
        }),
      },
    ],
  };

  const result = await handler(task);

  return parseHandlerResult(result);
}
