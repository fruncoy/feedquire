/*
  # Create Test Accounts

  Creates two test accounts for demonstration:
  - user@gmail.com (regular user)
  - admin@gmail.com (admin)
  
  Both with password: K@ribu@2025$
  
  NOTE: In production, these accounts should be deleted or secured differently.
*/

DO $$
DECLARE
  user_id_1 uuid;
  user_id_2 uuid;
BEGIN
  -- Create regular user account
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    raw_app_meta_data
  ) VALUES (
    (select id from auth.instances limit 1),
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'user@gmail.com',
    crypt('K@ribu@2025$', gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object('email', 'user@gmail.com'),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email'))
  ) ON CONFLICT DO NOTHING
  RETURNING id INTO user_id_1;

  -- Create admin account
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    raw_app_meta_data
  ) VALUES (
    (select id from auth.instances limit 1),
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@gmail.com',
    crypt('K@ribu@2025$', gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object('email', 'admin@gmail.com'),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email'))
  ) ON CONFLICT DO NOTHING
  RETURNING id INTO user_id_2;

  -- If user account was created, add profile
  IF user_id_1 IS NOT NULL THEN
    INSERT INTO profiles (user_id, role, full_name, account_status, verification_status)
    VALUES (user_id_1, 'user', 'Test User', 'approved', 'approved')
    ON CONFLICT DO NOTHING;

    INSERT INTO user_assessments (user_id, status)
    VALUES (user_id_1, 'approved')
    ON CONFLICT DO NOTHING;
  END IF;

  -- If admin account was created, add profile
  IF user_id_2 IS NOT NULL THEN
    INSERT INTO profiles (user_id, role, full_name, account_status, verification_status)
    VALUES (user_id_2, 'admin', 'Admin User', 'approved', 'approved')
    ON CONFLICT DO NOTHING;

    INSERT INTO user_assessments (user_id, status)
    VALUES (user_id_2, 'approved')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
