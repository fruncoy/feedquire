-- Add has_seen_welcome column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_seen_welcome BOOLEAN DEFAULT false;
