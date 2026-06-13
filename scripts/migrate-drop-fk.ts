import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: ['.env.local', '.env'] });

async function dropForeignKey() {
  const connectionString =
    process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Database URL not found');
  }

  const client = postgres(connectionString);

  try {
    console.log(
      'Dropping foreign key constraint on facebook_post_log.topic_id...',
    );

    // Try both possible constraint names
    await client`
      ALTER TABLE facebook_post_log
      DROP CONSTRAINT IF EXISTS facebook_post_log_topic_id_fkey
    `;

    await client`
      ALTER TABLE facebook_post_log
      DROP CONSTRAINT IF EXISTS facebook_post_log_topic_id_prayer_topics_id_fk
    `;

    console.log(
      '✓ Successfully dropped FK constraint on facebook_post_log.topic_id',
    );

    await client.end();
  } catch (err) {
    console.error('Error during migration:', err);
    await client.end();
    process.exit(1);
  }
}

dropForeignKey();
