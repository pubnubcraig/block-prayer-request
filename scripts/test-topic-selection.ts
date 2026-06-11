import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { engagementTopics } from '../lib/db/schema';
import { selectEngagementTopic } from '../lib/fb-post/select-engagement-topic';

// Load environment variables
config({ path: ['.env.local', '.env'] });

async function testTopicSelection() {
  const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('SUPABASE_DATABASE_URL or DATABASE_URL not found in environment');
  }

  console.log('Connecting to database...');
  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    // Get total topic count
    const allTopics = await db.select().from(engagementTopics);
    console.log(`Total topics in database: ${allTopics.length}\n`);

    // Show breakdown by content type
    const breakdown = allTopics.reduce((acc, topic) => {
      acc[topic.contentType] = (acc[topic.contentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Breakdown by content type:');
    Object.entries(breakdown)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });

    // Test selecting a topic
    console.log('\nTesting topic selection...');
    const selectedTopic = await selectEngagementTopic();

    console.log('\nSelected topic:');
    console.log(`  ID: ${selectedTopic.id}`);
    console.log(`  Content Type: ${selectedTopic.contentType}`);
    console.log(`  Prompt: ${selectedTopic.prompt.substring(0, 80)}...`);
    console.log(`  Last Used: ${selectedTopic.lastUsedAt}`);

    // Check how many topics haven't been used in 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const oldTopics = allTopics.filter(t => new Date(t.lastUsedAt) < ninetyDaysAgo);
    console.log(`\nTopics unused in last 90 days: ${oldTopics.length}`);

    await client.end();
    console.log('\n✓ Topic selection test completed successfully');
  } catch (err) {
    console.error('Error testing topic selection:', err);
    await client.end();
    process.exit(1);
  }
}

testTopicSelection();
