'use server';

import { createClient } from '@/utils/supabase/server';
import { encrypt } from '@/utils/encryption';
import { revalidatePath } from 'next/cache';

export async function getConfigs() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('system_config').select('*').order('key');
  
  if (error) {
    console.error('Failed to fetch configs:', error);
    return [];
  }

  return data.map(config => {
    // Mask encrypted values for the UI
    if (config.is_encrypted && config.value) {
      return { ...config, value: '********' };
    }
    return config;
  });
}

export async function updateConfig(formData: FormData) {
  const supabase = await createClient();
  
  const key = formData.get('key') as string;
  const rawValue = formData.get('value') as string;
  const isEncrypted = formData.get('is_encrypted') === 'true';
  const description = formData.get('description') as string;

  if (!key) return { error: 'Key is required' };

  if (rawValue === '********') {
    return { success: true }; // No change made
  }

  let finalValue = rawValue;
  if (isEncrypted && rawValue) {
    finalValue = encrypt(rawValue);
  }

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  const { error } = await supabase.from('system_config').upsert({
    key,
    value: finalValue,
    is_encrypted: isEncrypted,
    description: description || '',
    updated_at: new Date().toISOString(),
    updated_by: userId
  });

  if (error) {
    console.error('Failed to update config:', error);
    return { error: error.message };
  }

  await supabase.from('audit_logs').insert({
    action: 'CONFIG_UPDATED',
    details: `Updated configuration for key: ${key}`,
    performed_by: userId
  });

  revalidatePath('/admin/config');
  return { success: true };
}
