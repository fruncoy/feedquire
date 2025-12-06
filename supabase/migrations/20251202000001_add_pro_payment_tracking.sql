-- Add pro_payment_status and pro_payment_date to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pro_payment_status BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pro_payment_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pro_payment_reference TEXT;
