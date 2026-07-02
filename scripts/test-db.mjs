// DB connection + schema verifier. Run after adding Supabase keys to .env.local
// and applying the migration:  node scripts/test-db.mjs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isReal = (v) => v && !/^(https:\/\/mock|your_|xxx|placeholder|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.mock)/i.test(v.trim());

console.log('\n=== Key presence ===');
console.log('NEXT_PUBLIC_SUPABASE_URL      :', isReal(url) ? '✓ real' : '⚠️ placeholder/missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY :', isReal(anon) ? '✓ real' : '⚠️ placeholder/missing');
console.log('SUPABASE_SERVICE_ROLE_KEY     :', isReal(service) ? '✓ real' : '⚠️ placeholder/missing');

if (!isReal(url) || !isReal(service)) {
  console.error('\n✗ Add real NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local first.');
  process.exit(1);
}

const supabase = createClient(url, service, { auth: { persistSession: false } });

const TABLES = ['user_profiles', 'system_config', 'feature_flags', 'prompt_library', 'audit_logs'];

console.log('\n=== Schema check (tables reachable) ===');
let ok = true;
for (const t of TABLES) {
  const { error } = await supabase.from(t).select('*', { count: 'exact', head: true });
  if (error) {
    ok = false;
    console.log(`  ${t.padEnd(16)} ✗ ${error.message}`);
  } else {
    console.log(`  ${t.padEnd(16)} ✓ exists`);
  }
}

console.log('\n=== Auth reachable ===');
const { error: authErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
console.log(authErr ? `  ✗ ${authErr.message}` : '  ✓ auth admin API reachable');

console.log(ok && !authErr ? '\n✅ Database is wired up and ready.\n' : '\n⚠️ Some checks failed — run the migration in the Supabase SQL Editor.\n');
