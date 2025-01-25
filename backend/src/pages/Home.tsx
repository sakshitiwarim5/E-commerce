import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Users } from 'lucide-react';

export default function Home() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-12">
        <div className="flex justify-center mb-6">
          <Users className="w-16 h-16 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Mentorship Match</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with mentors and mentees in your field of interest
        </p>
        {!user && (
          <div className="space-x-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/signin')}
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}