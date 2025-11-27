-- Clean up staff table and related functions since we're using role-based auth

-- Drop the staff password verification function (if it exists)
drop function if exists public.verify_staff_password(text, text);

-- Drop the staff table (if it exists)
drop table if exists public.staff cascade;

-- This migration cleans up any staff-related components that may exist