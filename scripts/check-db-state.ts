import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { engagementTopics } from '../lib/db/schema';

config({ path: ['.env.local', '.env'] });

async function checkDatabaseState() {
  const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Database URL not found');
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    const allTopics = await db.select().from(engagementTopics);

    console.log(`Total topics in database: ${allTopics.length}\n`);

    // Breakdown by content type
    const breakdown = allTopics.reduce((acc, topic) => {
      acc[topic.contentType] = (acc[topic.contentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Breakdown by content type:');
    Object.entries(breakdown)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });

    await client.end();
  } catch (err) {
    console.error('Error:', err);
    await client.end();
    process.exit(1);
  }
}

checkDatabaseState();
