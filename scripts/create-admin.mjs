// Create (or reuse) a Supabase auth user, confirm it, promote to superadmin,
// and verify login. Uses the public signUp flow + direct DB for confirm/promote.
// Usage: node scripts/create-admin.mjs 'email' 'password'
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const dbUrl = process.env.DATABASE_URL;
const email = process.argv[2];
const password = process.argv[3];
if (!email || !password) { console.error("Usage: node scripts/create-admin.mjs 'email' 'password'"); process.exit(1); }

const supabase = createClient(url, anon, { auth: { persistSession: false } });

// 1. Sign up (creates auth.users row → fires handle_new_user trigger)
const { error: suErr } = await supabase.auth.signUp({ email, password });
if (suErr && !/already|registered|exists/i.test(suErr.message)) {
  console.error('✗ signUp error:', suErr.message); process.exit(1);
}
console.log(suErr ? 'ℹ user already existed — continuing' : '✓ signUp OK');

// 2. Confirm email + ensure profile + promote — over direct DB
const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 });
await client.connect();
await client.query(`UPDATE auth.users SET email_confirmed_at = COALESCE(email_confirmed_at, now()) WHERE email = $1`, [email]);
let res = await client.query(`UPDATE public.user_profiles SET role='superadmin', updated_at=now() WHERE email=$1 RETURNING id, role`, [email]);
if (res.rowCount === 0) {
  const u = await client.query(`SELECT id FROM auth.users WHERE email=$1`, [email]);
  if (u.rowCount) {
    await client.query(`INSERT INTO public.user_profiles (id,email,role) VALUES ($1,$2,'superadmin') ON CONFLICT (id) DO UPDATE SET role='superadmin'`, [u.rows[0].id, email]);
    console.log('✓ profile created + promoted');
  } else { console.error('✗ user not found in auth.users'); }
} else {
  console.log('✓ email confirmed + promoted to superadmin');
}
await client.end();

// 3. Verify login works
const { data: li, error: liErr } = await supabase.auth.signInWithPassword({ email, password });
console.log(liErr ? `✗ login check failed: ${liErr.message}` : `✅ login verified — user ${li.user.id} can sign in at /admin/login`);
