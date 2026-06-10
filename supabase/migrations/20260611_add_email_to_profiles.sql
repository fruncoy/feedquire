
-- Add email column to profiles table!
alter table public.profiles add column if not exists email text;

-- Update handle_new_user function to save email!
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, role, account_status, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    'user',
    'a7F9xQ2mP6kM4rT5', -- tier1 obfuscated
    new.email
  )
  on conflict (user_id) do update set email = new.email;
  return new;
end;
$$;

-- Backfill existing profiles with emails from auth.users!
update public.profiles p
set email = u.email
from auth.users u
where p.user_id = u.id and p.email is null;

-- Fix any profiles that got 'tier1' instead of the obfuscated value!
update public.profiles
set account_status = 'a7F9xQ2mP6kM4rT5'
where account_status = 'tier1';
