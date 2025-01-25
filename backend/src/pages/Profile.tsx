import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { updateProfile } from '../lib/api/profiles';
import type { Profile } from '../types/database';
import { UserCircle } from 'lucide-react';

export default function Profile() {
  const { user, profile: currentProfile } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<'mentor' | 'mentee'>('mentee');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (currentProfile) {
      setProfile(currentProfile);
      setFullName(currentProfile.full_name);
      setBio(currentProfile.bio || '');
      setRole(currentProfile.role);
      setLoading(false);
    }
  }, [user, currentProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const updatedProfile = await updateProfile({
        id: user.id,
        full_name: fullName,
        bio,
        role,
      });
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-6">
          <UserCircle className="w-20 h-20 text-blue-500" />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border rounded-md h-32"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Role</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="mentee"
                  checked={role === 'mentee'}
                  onChange={(e) => setRole(e.target.value as 'mentee')}
                  className="mr-2"
                />
                Mentee
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="mentor"
                  checked={role === 'mentor'}
                  onChange={(e) => setRole(e.target.value as 'mentor')}
                  className="mr-2"
                />
                Mentor
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}