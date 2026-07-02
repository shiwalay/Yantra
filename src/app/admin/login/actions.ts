'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    console.error("Login fetch error:", err);
    return { error: 'Database connection failed. Ensure Supabase keys are configured in your environment.' };
  }

  // After successful login, redirect to admin dashboard.
  // The middleware will verify if they have the 'superadmin' role and redirect them out if they don't.
  redirect('/admin');
}
