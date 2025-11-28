-- Assessment Review System
-- Adds admin capability to review and approve/reject assessments

-- Add assessment review columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS assessment_reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS assessment_reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS assessment_notes TEXT;

-- verification_status column already exists as text
-- Valid values: 'pending', 'qualified', 'not_qualified', 'awaiting_approval', 'approved', 'denied'

-- Function to approve assessment (moves user to tier 3)
CREATE OR REPLACE FUNCTION approve_assessment(
    target_user_id UUID,
    admin_user_id UUID,
    notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if admin has permission
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = admin_user_id 
        AND role = 'system_operator'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    -- Update user to tier 3 (qualified)
    UPDATE profiles 
    SET 
        account_status = '2hF2kQ7rD5xVfM1tZ', -- tier 3 obfuscated
        assessment_reviewed_by = admin_user_id,
        assessment_reviewed_at = NOW(),
        assessment_notes = notes
    WHERE user_id = target_user_id;
    
    -- Update logs
    UPDATE logs 
    SET 
        status = 'qualified',
        reviewed_at = NOW(),
        reviewed_by = admin_user_id
    WHERE user_id = target_user_id;
    
    RETURN TRUE;
END;
$$;

-- Function to reject assessment
CREATE OR REPLACE FUNCTION reject_assessment(
    target_user_id UUID,
    admin_user_id UUID,
    notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if admin has permission
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = admin_user_id 
        AND role = 'system_operator'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    -- Update user to rejected status
    UPDATE profiles 
    SET 
        account_status = 'rejected',
        assessment_reviewed_by = admin_user_id,
        assessment_reviewed_at = NOW(),
        assessment_notes = notes
    WHERE user_id = target_user_id;
    
    -- Update logs
    UPDATE logs 
    SET 
        status = 'not_qualified',
        reviewed_at = NOW(),
        reviewed_by = admin_user_id
    WHERE user_id = target_user_id;
    
    RETURN TRUE;
END;
$$;

-- Add reviewed_at and reviewed_by columns to logs table
ALTER TABLE logs 
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);