/*
  # Initial Schema Setup for Mentorship Platform

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - matches auth.users id
      - `full_name` (text) - user's full name
      - `bio` (text) - user's biography
      - `role` (text) - either 'mentor' or 'mentee'
      - `avatar_url` (text) - URL to user's avatar
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text) - skill name
      - `category` (text) - skill category
    
    - `user_skills`
      - Junction table between profiles and skills
      - `profile_id` (uuid, foreign key)
      - `skill_id` (uuid, foreign key)
      - `proficiency_level` (text)
    
    - `mentorship_requests`
      - `id` (uuid, primary key)
      - `mentor_id` (uuid, foreign key)
      - `mentee_id` (uuid, foreign key)
      - `status` (text) - 'pending', 'accepted', 'rejected'
      - `message` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text NOT NULL,
  bio text,
  role text NOT NULL CHECK (role IN ('mentor', 'mentee')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_skills junction table
CREATE TABLE user_skills (
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level text CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  PRIMARY KEY (profile_id, skill_id)
);

-- Create mentorship_requests table
CREATE TABLE mentorship_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mentee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT different_users CHECK (mentor_id != mentee_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Skills policies
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  USING (true);

-- User skills policies
CREATE POLICY "User skills are viewable by everyone"
  ON user_skills FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own skills"
  ON user_skills FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Mentorship requests policies
CREATE POLICY "Users can view their own mentorship requests"
  ON mentorship_requests FOR SELECT
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Users can create mentorship requests"
  ON mentorship_requests FOR INSERT
  WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Users can update their mentorship requests"
  ON mentorship_requests FOR UPDATE
  USING (auth.uid() = mentor_id OR auth.uid() = mentee_id)
  WITH CHECK (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION handle_profile_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile updates
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_profile_updated();

-- Create function to handle mentorship request updates
CREATE OR REPLACE FUNCTION handle_mentorship_request_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for mentorship request updates
CREATE TRIGGER on_mentorship_request_updated
  BEFORE UPDATE ON mentorship_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_mentorship_request_updated();