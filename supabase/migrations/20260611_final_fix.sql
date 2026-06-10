
-- SAFE FINAL FIX - run this in Supabase SQL Editor
-- Step 1: Remove ALL triggers on public.profiles to avoid recursion
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    FOR trigger_rec IN
        SELECT tgname
        FROM pg_trigger
        WHERE tgrelid::regclass::text = 'public.profiles'
        AND NOT tgisinternal
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(trigger_rec.tgname) || ' ON public.profiles;';
        RAISE NOTICE 'Dropped trigger: %', trigger_rec.tgname;
    END LOOP;
END $$;

-- Step 2: Add email column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Step 3: Backfill emails from auth.users for existing profiles
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.user_id = u.id AND p.email IS NULL;

-- Step 4: Reset handle_new_user function to the safe version
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, account_status, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user',
    'a7F9xQ2mP6kM4rT5',
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Fix any profiles with wrong account_status
UPDATE public.profiles
SET account_status = 'a7F9xQ2mP6kM4rT5'
WHERE account_status = 'tier1';

