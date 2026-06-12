import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { engagementTopics } from '../lib/db/schema';
import { ENGAGEMENT_SEED_TOPICS } from '../lib/fb-post/seed-engagement-topics';

// Load environment variables
config({ path: ['.env.local', '.env'] });

async function seedEngagementTopics() {
  const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('SUPABASE_DATABASE_URL or DATABASE_URL not found in environment');
  }

  console.log('Connecting to database...');
  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    // Check if topics already exist
    const existing = await db.select().from(engagementTopics);
    console.log(`Found ${existing.length} existing topics`);

    if (existing.length >= ENGAGEMENT_SEED_TOPICS.length) {
      console.log(`Already fully seeded (${existing.length} topics exist, ${ENGAGEMENT_SEED_TOPICS.length} in seed file)`);
      await client.end();
      return;
    }

    // Clear existing topics and re-seed with all topics
    if (existing.length > 0) {
      console.log('Clearing existing topics to re-seed with full set...');
      await db.delete(engagementTopics);
    }

    console.log(`Inserting ${ENGAGEMENT_SEED_TOPICS.length} engagement topics...`);

    // Insert all topics
    await db.insert(engagementTopics).values(
      ENGAGEMENT_SEED_TOPICS.map((t) => ({
        contentType: t.contentType,
        prompt: t.prompt,
        verseReference: t.verseReference ?? null,
        verseText: t.verseText ?? null,
        triviaAnswer: t.triviaAnswer ?? null,
        imageUrl: t.imageUrl ?? null,
      })),
    );

    console.log(`✓ Successfully inserted ${ENGAGEMENT_SEED_TOPICS.length} engagement topics`);

    // Verify insertion
    const inserted = await db.select().from(engagementTopics);
    console.log(`✓ Verified: ${inserted.length} topics in database`);

    // Show breakdown by content type
    const breakdown = inserted.reduce((acc, topic) => {
      acc[topic.contentType] = (acc[topic.contentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\nBreakdown by content type:');
    Object.entries(breakdown)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });

    await client.end();
  } catch (err) {
    console.error('Error seeding topics:', err);
    await client.end();
    process.exit(1);
  }
}

seedEngagementTopics();
