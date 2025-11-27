-- Create function to verify staff password
create or replace function verify_staff_password(staff_email text, staff_password text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 
    from public.staff 
    where email = staff_email 
    and password_hash = crypt(staff_password, password_hash)
    and is_active = true
  );
end;
$$;