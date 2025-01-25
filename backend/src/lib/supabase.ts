import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.error(
      'Supabase configuration is missing. Please ensure you have clicked "Connect to Supabase" in the top right corner and refresh the page.'
    );
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Please connect to Supabase first.'
    );
  }
  return supabase;
}