-- Add role column back to profiles table
alter table public.profiles add column if not exists role text not null default 'user';

-- Add constraint for role values
alter table public.profiles add constraint profiles_role_check check (role in ('user','admin'));

-- Update existing profiles to have user role
update public.profiles set role = 'user' where role is null;