-- Delete seeded test accounts so you can sign up afresh via the app
do $$
begin
  delete from auth.users where email in ('user@gmail.com','admin@gmail.com');
end $$;

