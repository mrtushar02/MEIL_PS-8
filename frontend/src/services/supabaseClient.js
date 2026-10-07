import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Singleton Supabase Client for MEIL ESG Frontend
 * Used for direct Cloud Storage (evidence document upload), Realtime data subscriptions,
 * and optional Supabase Auth integration.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Upload an evidence file to a Supabase Storage bucket (e.g. 'evidence-vault')
 * Falls back safely if Supabase is not yet configured.
 */
export async function uploadEvidenceToSupabase(bucketName, filePath, fileBlob) {
  if (!supabase) {
    console.warn('[Supabase] Client not configured. Operating in local storage mode.');
    return { error: 'Supabase credentials not configured' };
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, fileBlob, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('[Supabase Storage Error]', error);
    return { error };
  }

  const { data: publicData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return { data, publicUrl: publicData?.publicUrl };
}

export default supabase;
