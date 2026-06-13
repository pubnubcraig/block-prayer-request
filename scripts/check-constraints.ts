import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: ['.env.local', '.env'] });

async function checkConstraints() {
  const connectionString =
    process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Database URL not found');
  }

  const client = postgres(connectionString);

  try {
    const constraints = await client`
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      LEFT JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.table_name = 'facebook_post_log'
    `;

    console.log('Constraints on facebook_post_log:');
    constraints.forEach((c) => {
      console.log(
        `  ${c.constraint_type}: ${c.constraint_name} (${c.column_name} -> ${c.foreign_table_name}.${c.foreign_column_name})`,
      );
    });

    if (constraints.length === 0) {
      console.log('  No constraints found (besides primary key)');
    }

    await client.end();
  } catch (err) {
    console.error('Error:', err);
    await client.end();
    process.exit(1);
  }
}

checkConstraints();
