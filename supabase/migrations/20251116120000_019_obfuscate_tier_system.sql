-- Migration to obfuscate tier system
-- Replace tier1/tier2/tier3 with obfuscated values

-- Step 1: Drop existing check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_account_status_check;

-- Step 2: Update existing data
UPDATE profiles 
SET account_status = 'a7F9xQ2mP6kM4rT5' 
WHERE account_status = 'tier1';

UPDATE profiles 
SET account_status = '1Q3bF8vL1nT9pB6wR' 
WHERE account_status = 'tier2';

UPDATE profiles 
SET account_status = '2hF2kQ7rD5xVfM1tZ' 
WHERE account_status = 'tier3';

-- Step 3: Add new check constraint with obfuscated values
ALTER TABLE profiles ADD CONSTRAINT profiles_account_status_check 
CHECK (account_status IN ('a7F9xQ2mP6kM4rT5', '1Q3bF8vL1nT9pB6wR', '2hF2kQ7rD5xVfM1tZ'));

-- Step 4: Update any RLS policies that reference old tier names
-- (Add specific policy updates here if needed)

-- Step 5: Update any functions that use tier references
-- (Add function updates here if needed)