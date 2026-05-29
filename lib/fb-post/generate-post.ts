import OpenAI from 'openai';

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

const SYSTEM_PROMPT = `You are a social media content writer for a Christian prayer community called GoFish.
You write encouraging, uplifting Facebook posts that inspire people to pray.

RULES:
- Write 75-150 words (excluding the verse and hashtags)
- Always include the provided Bible verse with its reference
- Include a short, heartfelt prayer (2-3 sentences)
- End with: Need prayer? Visit https://gofish.life
- Include 3-5 relevant hashtags at the very end
- Be warm, inclusive, and denominationally neutral
- No political topics, no controversy
- Do not mention AI, algorithms, or automation
- Use an encouraging, pastoral tone
- Do not use emojis excessively (1-2 max if any)`;

export async function generateFacebookPost(
  topic: TopicInput,
): Promise<GeneratedPost> {
  const client = getClient();

  const userPrompt = `Write a Facebook post about "${topic.topic}" (category: ${topic.category}).

Include this Bible verse:
"${topic.verseText}" — ${topic.verseReference}

Remember to include a short prayer and end with the call to action for gofish.life.`;

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 500,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  });

  const content = completion.choices[0]?.message?.content?.trim();
  if (!content) throw new Error('OpenAI returned empty content');

  return {
    content,
    tokensUsed: completion.usage?.total_tokens ?? 0,
  };
}

export function generateFallbackPost(topic: TopicInput): string {
  return `Today, let us lift our hearts in prayer for ${topic.topic.toLowerCase()}.

"${topic.verseText}" — ${topic.verseReference}

Lord, we come before You today with grateful hearts. Guide us in ${topic.topic.toLowerCase()} and fill us with Your peace and wisdom. Help us to trust in Your plan for our lives. Amen.

Need prayer? Visit https://gofish.life

#Prayer #Faith #Bible #${topic.category.replace(/\s+/g, '')} #GoFish`;
}
