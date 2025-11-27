-- Migration to obfuscate admin role
-- Replace 'admin' with obfuscated value

-- Step 1: Drop existing role check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Step 2: Update existing admin users
UPDATE profiles 
SET role = 'system_operator' 
WHERE role = 'admin';

-- Step 3: Add new check constraint with obfuscated role
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'system_operator'));