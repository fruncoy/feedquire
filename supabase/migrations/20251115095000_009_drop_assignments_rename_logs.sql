BEGIN;

-- Drop platform_assignments table
DROP TABLE IF EXISTS public.platform_assignments CASCADE;

-- Rename user_assessments to logs
ALTER TABLE IF EXISTS public.user_assessments RENAME TO logs;

COMMIT;
