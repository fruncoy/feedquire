import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          role: 'user' | 'admin';
          verification_status: string;
          payment_status: string;
          account_status: string;
          test_score: number;
          total_earned: number;
          created_at: string;
          updated_at: string;
        };
      };
      ai_platforms: {
        Row: {
          id: string;
          domain: string;
          description: string;
          amount_per_submission: number;
          previous_amount_per_submission: number | null;
          is_assessment: boolean;
          status: string;
          total_interested: number;
          total_completed: number;
          created_at: string;
          updated_at: string;
        };
      };
      feedback_questions: {
        Row: {
          id: string;
          section_number: number;
          section_title: string;
          question_text: string;
          question_type: string;
          order_in_section: number;
          created_at: string;
        };
      };
      feedback_submissions: {
        Row: {
          id: string;
          user_id: string;
          platform_id: string;
          status: string;
          completion_percentage: number;
          amount_earned: number;
          rejection_reason: string | null;
          submitted_at: string | null;
          approved_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      submission_responses: {
        Row: {
          id: string;
          submission_id: string;
          question_id: string;
          response_text: string;
          created_at: string;
        };
      };
      logs: {
        Row: {
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
        };
      };
    };
  };
};
