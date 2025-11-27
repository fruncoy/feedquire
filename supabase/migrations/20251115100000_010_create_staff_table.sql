-- Create staff table for admin users
create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text not null default 'Admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Insert default admin user
insert into public.staff (email, password_hash, full_name) values 
('admin@gmail.com', crypt('K@ribu@2', gen_salt('bf')), 'System Administrator');

-- Remove role column from profiles table
alter table public.profiles drop column if exists role;

-- Create index for staff email lookups
create index if not exists idx_staff_email on public.staff(email);
create index if not exists idx_staff_active on public.staff(is_active);

-- Enable RLS on staff table
alter table public.staff enable row level security;

-- Create RLS policy for staff table (only staff can access)
create policy "Staff can view their own data" on public.staff
  for select using (auth.email() = email);