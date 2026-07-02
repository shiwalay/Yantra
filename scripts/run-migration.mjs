// Runs the schema migration over a direct Postgres connection.
// Usage: set DATABASE_URL in .env.local, then: node scripts/run-migration.mjs
import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const conn = process.env.DATABASE_URL;
if (!conn) {
  console.error('✗ Add DATABASE_URL (Supabase → Settings → Database → Connection string → URI) to .env.local');
  process.exit(1);
}

const file = process.argv[2] || 'supabase/migrations/0000_admin_os_schema.sql';
const sql = fs.readFileSync(file, 'utf8');
const client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 });

try {
  await client.connect();
  await client.query(sql);
  console.log('✅ Migration applied successfully — tables, policies, and trigger created.');
} catch (e) {
  console.error('✗ Migration error:', e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
