import { getSupabaseClient } from '../supabase';
import type { Profile } from '../../types/database';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await getSupabaseClient()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  
  return data;
}

export async function createProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
  const { data, error } = await getSupabaseClient()
    .from('profiles')
    .insert([{
      ...profile,
      full_name: profile.full_name || 'New User',
      role: profile.role || 'mentee'
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
  const { data, error } = await getSupabaseClient()
    .from('profiles')
    .update({
      ...profile,
      updated_at: new Date().toISOString()
    })
    .eq('id', profile.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}