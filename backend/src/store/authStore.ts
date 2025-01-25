import { create } from 'zustand';
import { getSupabaseClient } from '../lib/supabase';
import { getProfile, createProfile } from '../lib/api/profiles';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../types/database';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,

  signUp: async (email: string, password: string) => {
    const { data, error } = await getSupabaseClient().auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    
    if (data.user) {
      // Create initial profile for new user
      const profile = await createProfile({
        id: data.user.id,
        full_name: 'New User',
        role: 'mentee',
      });
      set({ profile });
    }
  },

  signIn: async (email: string, password: string) => {
    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },

  signOut: async () => {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null });
  },

  loadProfile: async () => {
    try {
      const { data: { user } } = await getSupabaseClient().auth.getUser();
      set({ user });

      if (user) {
        const profile = await getProfile(user.id);
        if (!profile) {
          // Create profile if it doesn't exist
          const newProfile = await createProfile({
            id: user.id,
            full_name: 'New User',
            role: 'mentee',
          });
          set({ profile: newProfile });
        } else {
          set({ profile });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      set({ loading: false });
    }
  },
}));