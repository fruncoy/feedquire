-- Update profiles table to use tier system
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_account_status_check,
ADD CONSTRAINT profiles_account_status_check CHECK (account_status IN ('tier1', 'tier2', 'tier3', 'rejected', 'banned'));

-- Update existing records to use tier1 as default
UPDATE public.profiles SET account_status = 'tier1' WHERE account_status = 'approved';
UPDATE public.profiles SET account_status = 'tier1' WHERE account_status = 'pending';

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, account_status, verification_status, payment_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user',
    'tier1',
    'pending_payment',
    'pending'
  );
  
  INSERT INTO public.user_assessments (user_id, status)
  VALUES (NEW.id, 'pending_payment');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();