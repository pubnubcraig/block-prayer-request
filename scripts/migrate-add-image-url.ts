import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: ['.env.local', '.env'] });

async function addImageUrlColumn() {
  const connectionString =
    process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Database URL not found');
  }

  const client = postgres(connectionString);

  try {
    console.log('Adding image_url column to engagement_topics table...');

    // Check if column already exists
    const [columnCheck] = await client`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'engagement_topics'
        AND column_name = 'image_url'
    `;

    if (columnCheck) {
      console.log('✓ Column image_url already exists, skipping migration');
      await client.end();
      return;
    }

    // Add image_url column
    await client`
      ALTER TABLE engagement_topics
      ADD COLUMN image_url text
    `;

    console.log('✓ Successfully added image_url column to engagement_topics');

    await client.end();
  } catch (err) {
    console.error('Error during migration:', err);
    await client.end();
    process.exit(1);
  }
}

addImageUrlColumn();
