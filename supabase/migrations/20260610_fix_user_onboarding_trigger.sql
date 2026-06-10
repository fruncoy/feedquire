
-- Fix handle_new_user() trigger to properly initialize user onboarding
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create profile if it doesn't exist AND user isn't a company
  IF NEW.raw_user_meta_data->>'is_company' IS DISTINCT FROM 'true' THEN
    INSERT INTO public.profiles (user_id, full_name, role, account_status, verification_status, payment_status)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
      'user',
      'a7F9xQ2mP6kM4rT5', -- tier1
      'pending',
      'unverified'
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Also create user_assessments record
    INSERT INTO public.user_assessments (user_id, status)
    VALUES (NEW.id, 'pending_payment')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

