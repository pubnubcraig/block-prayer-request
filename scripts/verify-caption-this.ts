import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { engagementTopics } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

config({ path: ['.env.local', '.env'] });

async function verifyCaptionThis() {
  const connectionString =
    process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Database URL not found');
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    const captionThisTopics = await db
      .select()
      .from(engagementTopics)
      .where(eq(engagementTopics.contentType, 'caption_this'));

    console.log(`Found ${captionThisTopics.length} caption_this topics:\n`);

    captionThisTopics.forEach((t, i) => {
      const hasImage = t.imageUrl ? '✓' : '✗';
      const imagePreview = t.imageUrl
        ? t.imageUrl.substring(0, 60) + '...'
        : 'NULL';
      console.log(`${hasImage} ${i + 1}. ${imagePreview}`);
    });

    const withImages = captionThisTopics.filter((t) => t.imageUrl).length;
    const withoutImages = captionThisTopics.length - withImages;

    console.log(`\n✓ ${withImages} topics have imageUrl`);
    if (withoutImages > 0) {
      console.log(`✗ ${withoutImages} topics missing imageUrl`);
    }

    await client.end();
  } catch (err) {
    console.error('Error:', err);
    await client.end();
    process.exit(1);
  }
}

verifyCaptionThis();
