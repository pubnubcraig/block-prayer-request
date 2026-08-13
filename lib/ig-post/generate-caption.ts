import OpenAI from 'openai';
import { topicToSlug, type InstagramTheme } from './select-instagram-topic';

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

export type GeneratedCaption = {
  fullCaption: string;
  firstComment: string;
  hashtags: string[];
  hookLine: string;
  tokensUsed: number;
};

const THEME_INSTRUCTIONS: Record<InstagramTheme, string> = {
  hope_encouragement:
    'This is a MORNING post (6 AM). Theme: Hope and Encouragement. Tone: Encouraging, peaceful, hopeful. Goal: Start the day focused on God.',
  engagement_interactive:
    'This is a MIDDAY post (12 PM). Theme: Engagement. Tone: Interactive, reflective, personal. Goal: Drive comments, shares, and discussion.',
  prayer_reflection:
    'This is an EVENING post (5 PM). Theme: Prayer and Reflection. Tone: Quiet, prayerful, contemplative. Goal: Generate saves, shares, and website visits.',
};

const SYSTEM_PROMPT = `You are a social media content creator for GoFish.Life, a Christian prayer platform.
Generate an Instagram caption that is biblically sound, faithful to Scripture, and emotionally resonant.

BIBLICAL REQUIREMENTS:
- Use ASV (American Standard Version) translation for all Scripture
- Be biblically accurate with traditional Christian interpretation
- Never use prosperity gospel messaging
- Never include politically charged content
- Use Scripture in proper context — never twist Scripture to fit a trend
- Prioritize biblical truth over engagement

Return ONLY valid JSON with the exact keys specified.`;

const captionSchema = {
  type: 'object' as const,
  additionalProperties: false,
  properties: {
    hook: {
      type: 'string' as const,
      description:
        'Attention-grabbing first line, under 15 words. Examples: "Someone scrolling today needs this.", "God has not forgotten you.", "Take 30 seconds and give this to God."',
    },
    scripture_verse: {
      type: 'string' as const,
      description: 'The full verse text in ASV translation',
    },
    scripture_reference: {
      type: 'string' as const,
      description: 'The verse reference, e.g. "Philippians 4:6-7"',
    },
    encouragement: {
      type: 'string' as const,
      description:
        'A short biblically grounded encouragement, under 100 words. Focus on hope, trust, faith, prayer, and God\'s character. Avoid cliches and vague motivational language.',
    },
    engagement_question: {
      type: 'string' as const,
      description:
        'One simple question to drive comments. Examples: "What can we pray for today?", "What area of life are you trusting God with right now?"',
    },
    first_comment: {
      type: 'string' as const,
      description:
        'An engagement-boosting pinned comment. Examples: "Drop a 🙏 if you\'re standing on God\'s promises.", "Tag someone who may need this encouragement."',
    },
    hashtags_large: {
      type: 'array' as const,
      items: { type: 'string' as const },
      description:
        '5 large Christian hashtags (500K+ posts). Examples: #Prayer, #Faith, #Jesus, #Christian, #Bible',
    },
    hashtags_medium: {
      type: 'array' as const,
      items: { type: 'string' as const },
      description:
        '5 medium hashtags (50K-500K posts). Examples: #DailyPrayer, #ChristianEncouragement, #PrayerWorks, #TrustGod, #BibleVerse',
    },
    hashtags_niche: {
      type: 'array' as const,
      items: { type: 'string' as const },
      description:
        '5 niche topic-specific hashtags (under 50K posts). Must be relevant to the prayer topic.',
    },
  },
  required: [
    'hook',
    'scripture_verse',
    'scripture_reference',
    'encouragement',
    'engagement_question',
    'first_comment',
    'hashtags_large',
    'hashtags_medium',
    'hashtags_niche',
  ],
};

function assembleCaption(
  parsed: {
    hook: string;
    scripture_verse: string;
    scripture_reference: string;
    encouragement: string;
    engagement_question: string;
  },
  topicSlug: string,
  hashtags: string[],
): string {
  return [
    parsed.hook,
    '',
    `📖 Scripture`,
    `"${parsed.scripture_verse}"`,
    `— ${parsed.scripture_reference} (ASV)`,
    '',
    parsed.encouragement,
    '',
    `💬 ${parsed.engagement_question}`,
    '',
    `🙏 Need prayer? Visit:`,
    `https://gofish.life/prayer-topics/${topicSlug}`,
    '',
    hashtags.join(' '),
  ].join('\n');
}

export async function generateInstagramCaption(
  topic: TopicInput,
  theme: InstagramTheme,
): Promise<GeneratedCaption> {
  const client = getClient();
  const themeInstruction = THEME_INSTRUCTIONS[theme];

  const userMessage = [
    themeInstruction,
    '',
    `Prayer Topic: ${topic.topic}`,
    `Category: ${topic.category}`,
    `Default Verse Reference: ${topic.verseReference}`,
    `Default Verse Text (for reference — you must use ASV translation): ${topic.verseText}`,
    '',
    'Generate the Instagram caption content. Use the ASV translation of this verse or select a more fitting ASV verse for this topic if appropriate.',
  ].join('\n');

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 1000,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'instagram_caption',
        strict: true,
        schema: captionSchema,
      },
    },
  });

  const tokensUsed = completion.usage?.total_tokens ?? 0;
  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('OpenAI returned no caption content');

  const parsed = JSON.parse(raw) as {
    hook: string;
    scripture_verse: string;
    scripture_reference: string;
    encouragement: string;
    engagement_question: string;
    first_comment: string;
    hashtags_large: string[];
    hashtags_medium: string[];
    hashtags_niche: string[];
  };

  const allHashtags = [
    ...parsed.hashtags_large,
    ...parsed.hashtags_medium,
    ...parsed.hashtags_niche,
  ].map((h) => (h.startsWith('#') ? h : `#${h}`));

  const slug = topicToSlug(topic.topic);
  const fullCaption = assembleCaption(parsed, slug, allHashtags);

  return {
    fullCaption,
    firstComment: parsed.first_comment,
    hashtags: allHashtags,
    hookLine: parsed.hook,
    tokensUsed,
  };
}

export function generateFallbackCaption(
  topic: TopicInput,
): GeneratedCaption {
  const slug = topicToSlug(topic.topic);
  const hashtags = [
    '#Prayer',
    '#Faith',
    '#Jesus',
    '#Christian',
    '#Bible',
    '#DailyPrayer',
    '#ChristianEncouragement',
    '#PrayerWorks',
    '#TrustGod',
    '#BibleVerse',
    `#${topic.topic.replace(/\s+/g, '')}Prayer`,
    '#HopeInChrist',
    '#GodIsNear',
    '#PrayerWarrior',
    '#GoFishLife',
  ];

  const fullCaption = [
    `God has not forgotten you.`,
    '',
    `📖 Scripture`,
    `"${topic.verseText}"`,
    `— ${topic.verseReference} (ASV)`,
    '',
    `Today, let us lift our hearts in prayer for ${topic.topic.toLowerCase()}. God's Word reminds us that He is always near, ready to guide and comfort us in every season of life. Trust in His promises.`,
    '',
    `💬 What can we pray for you today?`,
    '',
    `🙏 Need prayer? Visit:`,
    `https://gofish.life/prayer-topics/${slug}`,
    '',
    hashtags.join(' '),
  ].join('\n');

  return {
    fullCaption,
    firstComment: 'Drop a 🙏 if you need prayer today. We are praying for you.',
    hashtags,
    hookLine: 'God has not forgotten you.',
    tokensUsed: 0,
  };
}
