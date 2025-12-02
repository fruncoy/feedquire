-- Add mpesa_number column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mpesa_number TEXT;