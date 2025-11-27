-- Create profiles for any auth users that don't have them
INSERT INTO public.profiles (user_id, full_name, role, account_status, verification_status, payment_status)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
  'user',
  'tier1',
  'pending_payment',
  'pending'
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE p.user_id IS NULL;

-- Create user_assessments for any users that don't have them
INSERT INTO public.user_assessments (user_id, status)
SELECT 
  au.id,
  'pending_payment'
FROM auth.users au
LEFT JOIN public.user_assessments ua ON au.id = ua.user_id
WHERE ua.user_id IS NULL;