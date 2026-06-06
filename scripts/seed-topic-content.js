/**
 * Seed script: generates differentiated content for prayer and Bible verse pages.
 *
 * For each prayer_topic that lacks content, calls OpenAI to generate:
 *   - samplePrayer: a written-out prayer (~100-150 words)
 *   - prayerPrompts: 3-4 personal reflection questions
 *   - additionalVerses: 3-4 extra Bible verses relevant to the topic
 *   - verseContext: 2-3 sentences of historical/literary context for the featured verse
 *
 * Usage:
 *   node scripts/seed-topic-content.js            # process all topics missing content
 *   node scripts/seed-topic-content.js --limit 5  # process only 5 topics (for review)
 *   node scripts/seed-topic-content.js --dry-run  # preview without writing to DB
 */

require('dotenv').config();
require('dotenv').config({ path: '.env.local', override: true });

const postgres = require('postgres');
const OpenAI = require('openai');

const url = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
if (!url) { console.error('ERROR: No database URL found'); process.exit(1); }

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) { console.error('ERROR: OPENAI_API_KEY not set'); process.exit(1); }

const sql = postgres(url, { prepare: false });
const openai = new OpenAI.default({ apiKey });

const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const dryRun = args.includes('--dry-run');

const SYSTEM_PROMPT = `You are a Christian content writer creating material for a prayer and Bible study website. Your tone is warm, non-denominational, and grounded in Scripture. You write for a general Christian audience.

You will receive a prayer topic with its category and a featured Bible verse. Generate the following:

1. sample_prayer: A heartfelt, non-denominational prayer (~100-150 words) that:
   - Addresses God directly
   - References or echoes the featured verse
   - Is specific to the topic (not generic)
   - Ends with "In Jesus' name, Amen."

2. prayer_prompts: An array of 3-4 personal reflection questions that help someone pray about this topic. Questions should be specific, introspective, and actionable. Do NOT start every question with "What" — vary the question starters.

3. additional_verses: An array of 3-4 Bible verses (different from the featured verse) relevant to this topic. Each must include:
   - "reference": the verse citation (e.g., "Romans 8:28")
   - "text": the NIV text of the verse (be accurate — use the actual NIV wording)

4. verse_context: 2-3 sentences explaining the featured verse's context — who wrote it, the situation/audience, and why it remains relevant for this topic today. Be factual and concise.

Return ONLY valid JSON matching the schema.`;

const responseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    sample_prayer: { type: 'string' },
    prayer_prompts: {
      type: 'array',
      items: { type: 'string' },
    },
    additional_verses: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          reference: { type: 'string' },
          text: { type: 'string' },
        },
        required: ['reference', 'text'],
      },
    },
    verse_context: { type: 'string' },
  },
  required: ['sample_prayer', 'prayer_prompts', 'additional_verses', 'verse_context'],
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateContent(topic) {
  const userMessage = `Topic: ${topic.topic}
Category: ${topic.category}
Featured Verse: ${topic.verse_reference}
Verse Text: "${topic.verse_text}"`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 3000,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    response_format: { type: 'json_object' },
  });

  const choice = completion.choices[0];
  const raw = choice?.message?.content;
  if (!raw) throw new Error('OpenAI returned empty response');
  if (choice.finish_reason === 'length') {
    throw new Error(`Response truncated (${raw.length} chars, finish_reason=length). Increase max_tokens.`);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`JSON parse error (finish_reason=${choice.finish_reason}, chars=${raw.length}): ${e.message}`);
  }
  const tokens = completion.usage?.total_tokens || 0;
  return { parsed, tokens };
}

async function main() {
  // Fetch topics that are missing content
  const topics = await sql`
    SELECT id, topic, category, verse_reference, verse_text
    FROM prayer_topics
    WHERE active = true
      AND (sample_prayer IS NULL OR additional_verses IS NULL)
    ORDER BY category, topic
  `;

  const toProcess = topics.slice(0, limit);
  console.log(`Found ${topics.length} topics needing content. Processing ${toProcess.length}.`);
  if (dryRun) console.log('DRY RUN — no database writes will occur.\n');

  let totalTokens = 0;
  let processed = 0;
  let errors = 0;

  for (const topic of toProcess) {
    try {
      process.stdout.write(`[${processed + 1}/${toProcess.length}] ${topic.topic} (${topic.category})... `);

      const { parsed, tokens } = await generateContent(topic);
      totalTokens += tokens;

      if (dryRun) {
        console.log(`OK (${tokens} tokens)`);
        console.log(`  Prayer: ${parsed.sample_prayer.substring(0, 80)}...`);
        console.log(`  Prompts: ${parsed.prayer_prompts.length} questions`);
        console.log(`  Verses: ${parsed.additional_verses.map(v => v.reference).join(', ')}`);
        console.log(`  Context: ${parsed.verse_context.substring(0, 80)}...`);
        console.log();
      } else {
        await sql`
          UPDATE prayer_topics SET
            sample_prayer = ${parsed.sample_prayer},
            prayer_prompts = ${JSON.stringify(parsed.prayer_prompts)},
            additional_verses = ${JSON.stringify(parsed.additional_verses)},
            verse_context = ${parsed.verse_context}
          WHERE id = ${topic.id}
        `;
        console.log(`OK (${tokens} tokens)`);
      }

      processed++;

      // Rate limit: 200ms delay between calls
      if (processed < toProcess.length) await sleep(200);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      errors++;
      // Continue with next topic
      await sleep(1000);
    }
  }

  console.log(`\nDone. Processed: ${processed}, Errors: ${errors}, Total tokens: ${totalTokens}`);
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
