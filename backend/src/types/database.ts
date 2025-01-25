export interface Profile {
  id: string;
  full_name: string;
  bio: string | null;
  role: 'mentor' | 'mentee';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  created_at: string;
}

export interface UserSkill {
  profile_id: string;
  skill_id: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface MentorshipRequest {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string | null;
  created_at: string;
  updated_at: string;
}