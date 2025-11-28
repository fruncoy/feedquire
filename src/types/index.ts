export type UserRole = 'user' | 'system_operator';

export interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: UserRole;
  account_status: AccountStatus;
  verification_status?: string;
  payment_status?: string;
  test_score: number;
  total_earned: number;
  created_at: string;
  updated_at: string;
}





export type AccountStatus = 'a7F9xQ2mP6kM4rT5' | '1Q3bF8vL1nT9pB6wR' | 'tier3' | 'rejected' | 'banned';

export interface AIPlatform {
  id: string;
  domain: string;
  description: string;
  amount_per_submission: number;
  previous_amount_per_submission?: number;
  is_assessment?: boolean;
  status: 'active' | 'paused' | 'completed';
  total_interested: number;
  total_completed: number;
  created_at: string;
  updated_at: string;
}

export interface FeedbackQuestion {
  id: string;
  section_number: number;
  section_title: string;
  question_text: string;
  question_type: 'textarea' | 'text' | 'rating' | 'multiple_choice';
  order_in_section: number;
  created_at: string;
}

export interface FeedbackSubmission {
  id: string;
  user_id: string;
  platform_id: string;
  status: 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'paid';
  completion_percentage: number;
  amount_earned: number;
  rejection_reason: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmissionResponse {
  id: string;
  submission_id: string;
  question_id: string;
  response_text: string;
  created_at: string;
}

export interface PlatformAssignment {
  id: string;
  user_id: string;
  platform_id: string;
  status: 'available' | 'in_progress' | 'completed';
  assigned_at: string;
}

export interface UserAssessment {
  id: string;
  user_id: string;
  status: string;
  payment_verified_at: string | null;
  test_started_at: string | null;
  test_completed_at: string | null;
  test_score: number;
  approval_notes: string | null;
  created_at: string;
  updated_at: string;
}
