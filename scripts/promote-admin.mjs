// Promote an existing user to superadmin over the direct DB connection.
// Usage: node scripts/promote-admin.mjs you@email.com
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const email = process.argv[2];
if (!email) { console.error('Usage: node scripts/promote-admin.mjs <email>'); process.exit(1); }
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL missing in .env.local'); process.exit(1); }

const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 });
try {
  await client.connect();
  const res = await client.query(
    `UPDATE public.user_profiles SET role = 'superadmin', updated_at = NOW() WHERE email = $1 RETURNING id, email, role`,
    [email]
  );
  if (res.rowCount === 0) {
    console.error(`✗ No profile found for ${email}. Create the auth user first (Supabase → Authentication → Add user), then re-run.`);
    process.exitCode = 1;
  } else {
    console.log(`✅ ${res.rows[0].email} is now ${res.rows[0].role}.`);
  }
} catch (e) {
  console.error('✗ Error:', e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
