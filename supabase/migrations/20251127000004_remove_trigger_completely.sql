-- Fix the trigger function to use correct obfuscated tier value
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, account_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user',
    'a7F9xQ2mP6kM4rT5'  -- Use obfuscated tier1 value
  );
  
  INSERT INTO public.user_assessments (user_id, status)
  VALUES (NEW.id, 'pending_payment');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;