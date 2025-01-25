import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getSupabaseClient } from '../lib/supabase';
import type { Profile } from '../types/database';
import { Search, UserCircle } from 'lucide-react';

export default function Discovery() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'mentor' | 'mentee' | ''>('');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    loadProfiles();
  }, [user, navigate, roleFilter]);

  async function loadProfiles() {
    try {
      let query = getSupabaseClient()
        .from('profiles')
        .select('*')
        .neq('id', user?.id);

      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Discover</h1>
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'mentor' | 'mentee' | '')}
              className="border rounded-md p-2"
            >
              <option value="">All Roles</option>
              <option value="mentor">Mentors</option>
              <option value="mentee">Mentees</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start space-x-4">
                <UserCircle className="w-12 h-12 text-blue-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold">{profile.full_name}</h2>
                  <span className="inline-block px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800 capitalize">
                    {profile.role}
                  </span>
                  {profile.bio && (
                    <p className="mt-2 text-gray-600">{profile.bio}</p>
                  )}
                  <button className="mt-4 text-blue-500 hover:text-blue-600">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}