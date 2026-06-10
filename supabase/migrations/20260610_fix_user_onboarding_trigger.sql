
-- Update handle_new_user to skip profile creation for company accounts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create profile if it doesn't exist AND user isn't a company
  IF NEW.raw_user_meta_data->>'is_company' IS DISTINCT FROM 'true' THEN
    INSERT INTO public.profiles (user_id, full_name, role, account_status)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
      'user',
      'a7F9xQ2mP6kM4rT5'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

