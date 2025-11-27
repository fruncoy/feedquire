-- Remove duplicate submissions first
DELETE FROM public.feedback_submissions 
WHERE ctid NOT IN (
  SELECT MIN(ctid) 
  FROM public.feedback_submissions 
  GROUP BY user_id, platform_id
);

-- Add unique constraint to prevent multiple submissions per platform per user
ALTER TABLE public.feedback_submissions 
ADD CONSTRAINT unique_user_platform_submission 
UNIQUE (user_id, platform_id);