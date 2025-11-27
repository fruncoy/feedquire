-- Remove deprecated InstaSend column and seed AI platforms
BEGIN;

-- Drop column from profiles if present
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS instasend_payment_id;

-- Extend ai_platforms for assessment flag and previous amount tracking
ALTER TABLE public.ai_platforms
  ADD COLUMN IF NOT EXISTS previous_amount_per_submission numeric(10,2),
  ADD COLUMN IF NOT EXISTS is_assessment boolean NOT NULL DEFAULT false;

-- Seed AI platforms needed for assessments
DELETE FROM public.ai_platforms
  WHERE domain IN ('www.perplexity.ai', 'www.nanobanana-2.net', 'www.visualgpt.io');

INSERT INTO public.ai_platforms (domain, description, amount_per_submission, previous_amount_per_submission, is_assessment, status, total_interested, total_completed)
VALUES
  ('www.perplexity.ai', 'Assessment for Perplexity.ai (was $3.01, now $0.00)', 0.00, 3.01, true, 'active', 0, 0),
  ('www.nanobanana-2.net', 'Task for Nanobanana-2', 2.45, NULL, false, 'active', 0, 0),
  ('www.visualgpt.io', 'Task for VisualGPT', 2.33, NULL, false, 'active', 0, 0);

COMMIT;
