-- Drop any existing RLS policies that might reference role column
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Recreate RLS policies without role references
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);

-- Ensure role column is completely removed
alter table public.profiles drop column if exists role;

-- Update any constraints that might reference role
alter table public.profiles drop constraint if exists profiles_role_check;