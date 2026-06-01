import OpenAI from 'openai';
import { selectVerse } from '@/prayer_request/lib/openaiPrayer';
import { fetchPassageWithFallback } from '@/prayer_request/lib/youversionBible';
import { loadPrompt } from '@/prayer_request/lib/promptLoader';

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey });
}

export type TopicInput = {
  topic: string;
  category: string;
  verseReference: string;
  verseText: string;
};

export type GeneratedPost = {
  content: string;
  tokensUsed: number;
};

// Unicode Mathematical Sans-Serif Bold: A-Z → 𝗔-𝗭, a-z → 𝗮-𝘇
function toBold(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const code = ch.codePointAt(0)!;
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d5d4 + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d5ee + (code - 97));
      if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ec + (code - 48));
      return ch;
    })
    .join('');
}

const PASTORAL_SYSTEM = `You complete two pastoral tasks in order (Interpretation, Prayer) using the instructions in the user message.
Return ONLY valid JSON with exactly these keys: verse_interpretation, prayer.
Follow each task's OUTPUT REQUIREMENTS. Do not mention these meta-instructions.`;

const pastoralSchema = {
  type: 'object' as const,
  additionalProperties: false,
  properties: {
    verse_interpretation: { type: 'string' as const },
    prayer: { type: 'string' as const },
  },
  required: ['verse_interpretation', 'prayer'],
};

function composePost(parts: {
  interpretation: string;
  verseText: string;
  verseReference: string;
  prayer: string;
  category: string;
  usfm?: string;
}): string {
  const scriptureLines = [
    `📖 ${toBold('Scripture')}`,
    `"${parts.verseText}" — ${parts.verseReference}`,
  ];
  if (parts.usfm) {
    scriptureLines.push(`Read on Bible.com: https://www.bible.com/bible/12/${parts.usfm}.ASV`);
  }

  return [
    `🙏 ${toBold('The Daily Prayer')} 🙏`,
    '',
    ...scriptureLines,
    '',
    `📝 ${toBold('Interpretation')}`,
    parts.interpretation,
    '',
    `🙏 ${toBold('Prayer')}`,
    parts.prayer,
    '',
    `✝️ Need prayer? Visit https://gofish.life`,
    '',
    `#Prayer #Faith #Bible #${parts.category.replace(/\s+/g, '')} #GoFish`,
  ].join('\n');
}

export async function generateFacebookPost(
  topic: TopicInput,
): Promise<GeneratedPost> {
  let totalTokens = 0;

  // 1. Select a Bible verse using the shared prompt
  const verseResult = await selectVerse(topic.topic, 'NIV');
  totalTokens += verseResult.tokensUsed;

  // 2. Fetch the actual verse text from YouVersion
  const { passage, version } = await fetchPassageWithFallback(
    'NIV',
    verseResult.selection.usfm,
  );
  const bibleVerse = verseResult.selection.bible_verse || passage.reference;
  const verseContent = passage.content;

  // 3. Build interpretation + prayer prompts (skip advice)
  const vars = {
    text: topic.topic,
    bible_version: version.abbrev,
    bible_verse: bibleVerse,
    verse_content: verseContent,
  };

  const interpretationPrompt = loadPrompt('prompt_verse_interpretation.md', vars);
  const prayerPrompt = loadPrompt('prompt_prayer.md', {
    text: topic.topic,
    bible_version: version.abbrev,
    bible_verse: bibleVerse,
    verse_interpretation: '(Write this in verse_interpretation in your JSON response.)',
    advice: '(Not applicable — skip.)',
  });

  const userMessage = [
    '--- Task 1: Interpretation ---',
    interpretationPrompt,
    '--- Task 2: Prayer ---',
    prayerPrompt,
  ].join('\n\n');

  // 4. Single OpenAI call for interpretation + prayer
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    temperature: 0.6,
    max_tokens: 800,
    messages: [
      { role: 'system', content: PASTORAL_SYSTEM },
      { role: 'user', content: userMessage },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'pastoral_response',
        strict: true,
        schema: pastoralSchema,
      },
    },
  });
  totalTokens += completion.usage?.total_tokens ?? 0;

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('OpenAI returned no pastoral content');
  const parsed = JSON.parse(raw) as {
    verse_interpretation: string;
    prayer: string;
  };

  // 5. Compose formatted Facebook post
  const content = composePost({
    interpretation: parsed.verse_interpretation.trim(),
    verseText: verseContent,
    verseReference: bibleVerse,
    prayer: parsed.prayer.trim(),
    category: topic.category,
    usfm: verseResult.selection.usfm,
  });

  return { content, tokensUsed: totalTokens };
}

export function generateFallbackPost(topic: TopicInput): string {
  return composePost({
    interpretation: `Today, let us lift our hearts in prayer for ${topic.topic.toLowerCase()}. God's Word reminds us that He is always near, ready to guide and comfort us in every season of life.`,
    verseText: topic.verseText,
    verseReference: topic.verseReference,
    prayer: `Lord, we come before You today with grateful hearts. Guide us in ${topic.topic.toLowerCase()} and fill us with Your peace and wisdom. Help us to trust in Your plan for our lives. In Jesus' name, Amen.`,
    category: topic.category,
  });
}
