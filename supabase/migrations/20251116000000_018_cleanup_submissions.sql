-- Remove in_progress submissions and enforce one submission per user per platform
-- Delete all in_progress submissions
DELETE FROM public.feedback_submissions WHERE status = 'in_progress';

-- Add unique constraint to ensure one submission per user per platform (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_user_platform_submission'
    ) THEN
        ALTER TABLE public.feedback_submissions 
        ADD CONSTRAINT unique_user_platform_submission 
        UNIQUE (user_id, platform_id);
    END IF;
END $$;

-- Update RLS policies to exclude in_progress submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON public.feedback_submissions;
CREATE POLICY "Users can view own submissions" ON public.feedback_submissions
FOR SELECT USING (
  auth.uid() = user_id::uuid AND status != 'in_progress'
);

DROP POLICY IF EXISTS "Users can insert own submissions" ON public.feedback_submissions;
CREATE POLICY "Users can insert own submissions" ON public.feedback_submissions
FOR INSERT WITH CHECK (
  auth.uid() = user_id::uuid AND status != 'in_progress'
);

DROP POLICY IF EXISTS "Users can update own submissions" ON public.feedback_submissions;
CREATE POLICY "Users can update own submissions" ON public.feedback_submissions
FOR UPDATE USING (
  auth.uid() = user_id::uuid AND status != 'in_progress'
) WITH CHECK (
  auth.uid() = user_id::uuid AND status != 'in_progress'
);