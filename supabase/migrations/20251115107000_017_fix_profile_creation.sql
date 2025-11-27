-- Fix profile creation issues

-- Create or replace the trigger function for automatic profile creation
-- Only insert the core required fields
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, role, account_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    'user',
    'tier1'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Note: If verification_status and payment_status columns don't exist,
-- they should be removed from the code, not added to the database