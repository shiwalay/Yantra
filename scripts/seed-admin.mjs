import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Must use service role to bypass RLS

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide the email of the user to promote.");
    console.error("Usage: node scripts/seed-admin.mjs admin@example.com");
    process.exit(1);
  }

  // 1. Get User ID from auth.users (requires service_role)
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) {
    console.error("Error fetching users:", userError.message);
    return;
  }
  
  const targetUser = users.users.find(u => u.email === email);
  if (!targetUser) {
    console.error(`User with email ${email} not found in Supabase Auth. Please sign up on the site first.`);
    return;
  }

  // 2. Update user_profiles table role to 'superadmin'
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ role: 'superadmin' })
    .eq('id', targetUser.id);

  if (updateError) {
    console.error("Error updating profile:", updateError.message);
  } else {
    console.log(`Success! ${email} has been promoted to superadmin.`);
  }
}

seedAdmin();
