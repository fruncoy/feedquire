
-- SAFE RESET: Restore handle_new_user() to a completely safe version
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create profile if it doesn't exist (NO recursion, NO conflicts)
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
