
-- ============================================================================
-- FEEDQUIRE DEMO SEED DATA
-- ============================================================================
-- This file contains:
-- - 2 Verified Companies
-- - 10 Kenyan Test Users
-- - Demo Software Links, Submissions, and Payments
-- ============================================================================

-- NOTE: Passwords for these demo accounts are all "Password123!" (without quotes)
-- You need to set the passwords manually in Supabase Auth, or use the auth API

-- First, let's disable triggers temporarily to avoid conflicts
SET session_replication_role = replica;

-- ============================================================================
-- PART 1: CREATE COMPANY USERS (2 COMPANIES)
-- ============================================================================
-- We'll create auth users first, then link to companies table
-- NOTE: In real use, you'd set passwords via Supabase UI or API
-- For this demo, these are placeholder UUIDs; you'll need to create the actual users

-- Company 1: TechSolutions Kenya
-- Email: techsolutions@example.com
-- Password: Password123!
-- Company: TechSolutions Kenya (Verified, Payment Verified)

-- Company 2: InnovateHub Africa
-- Email: innovatehub@example.com
-- Password: Password123!
-- Company: InnovateHub Africa (Verified, Payment Verified)

-- ============================================================================
-- PART 2: INSERT COMPANIES (You need to replace the user_ids with real ones after creating auth users!)
-- ============================================================================
-- NOTE: First create the users in Supabase Auth dashboard, get their UUIDs, then update this!

-- Uncomment and update these after creating the auth users:
--
-- INSERT INTO public.companies (user_id, company_name, company_email, company_website, verification_status, payment_status, account_status)
-- VALUES
--   ('YOUR_COMPANY1_USER_UUID_HERE', 'TechSolutions Kenya', 'techsolutions@example.com', 'https://techsolutionskenya.co.ke', 'verified', 'verified', 'active'),
--   ('YOUR_COMPANY2_USER_UUID_HERE', 'InnovateHub Africa', 'innovatehub@example.com', 'https://innovatehubafrica.com', 'verified', 'verified', 'active');

-- ============================================================================
-- PART 3: CREATE 10 KENYAN TEST USERS
-- ============================================================================
-- Again, first create auth users in Supabase, get their UUIDs, then update!
-- Test users:
-- 1. wanjiru@example.com
-- 2. otieno@example.com
-- 3. auma@example.com
-- 4. kariuki@example.com
-- 5. mwangi@example.com
-- 6. chebet@example.com
-- 7. omondi@example.com
-- 8. mutua@example.com
-- 9. juma@example.com
-- 10. ndemo@example.com

-- ============================================================================
-- PART 4: INSERT PROFILES FOR TEST USERS (Replace user_ids!)
-- ============================================================================
-- Uncomment and update after creating auth users:
--
-- INSERT INTO public.profiles (user_id, full_name, role, account_status, verification_status, payment_status, test_score, total_earned)
-- VALUES
--   ('USER1_UUID', 'Grace Wanjiru', 'user', 'a7F9xQ2mP6kM4rT5', 'verified', 'verified', 92, 4200),
--   ('USER2_UUID', 'James Otieno', 'user', 'a7F9xQ2mP6kM4rT5', 'verified', 'verified', 88, 3600),
--   ('USER3_UUID', 'Amina Auma', 'user', 'a7F9xQ2mP6kM4rT5', 'verified', 'verified', 95, 5100),
--   ('USER4_UUID', 'Peter Kariuki', 'user', 'a7F9xQ2mP6kM4rT5', 'verified', 'verified', 85, 3300),
--   ('USER5_UUID', 'Lucy Mwangi', 'user', 'a7F9xQ2mP6kM4rT5', 'verified', 'verified', 90, 4000),
--   ('USER6_UUID', 'David Chebet', 'user', 'a7F9xQ2mP6kM4rT5', 'verified', 'verified', 87, 3800),
--   ('USER7_UUID', 'Esther Omondi', 'user', 'a7F9xQ2mP6kM4rT5', 'verified', 'verified', 93, 4400),
--   ('USER8_UUID', 'Joseph Mutua', 'user', 'a7F9xQ2mP6kM4rT5', 'verified', 'verified', 89, 3900),
--   ('USER9_UUID', 'Sarah Juma', 'user', 'a7F9xQ2mP6kM4rT5', 'verified', 'verified', 91, 4100),
--   ('USER10_UUID', 'Michael Ndemo', 'user', 'a7F9xQ2mP6kM4rT5', 'verified', 'verified', 86, 3500);

-- ============================================================================
-- PART 5: INSERT SOFTWARE LINKS (For both companies)
-- ============================================================================
-- First, you need to get the company IDs from the companies table after inserting!
-- Then replace the company_id placeholders!

-- Uncomment and update:
--
-- -- TechSolutions Kenya's Software
-- INSERT INTO public.software_links (company_id, name, description, website, total_budget, max_responses, amount_per_submission, status)
-- VALUES
--   ('COMPANY1_UUID_HERE', 'TaskMaster Pro', 'Productivity app for Kenyan SMEs', 'https://taskmasterpro.co.ke', 18200, 10, 1820, 'completed'),
--   ('COMPANY1_UUID_HERE', 'ChamaApp', 'Group savings management app', 'https://chamaapp.co.ke', 21840, 12, 1820, 'active');
--
-- -- InnovateHub Africa's Software
-- INSERT INTO public.software_links (company_id, name, description, website, total_budget, max_responses, amount_per_submission, status)
-- VALUES
--   ('COMPANY2_UUID_HERE', 'AgriTech Connect', 'Connect farmers to markets', 'https://agritechconnect.co.ke', 25480, 14, 1820, 'completed'),
--   ('COMPANY2_UUID_HERE', 'HealthHub Kenya', 'Telehealth platform', 'https://healthhubkenya.com', 18200, 10, 1820, 'active');

-- ============================================================================
-- PART 6: INSERT FEEDBACK SUBMISSIONS & RESPONSES
-- ============================================================================
-- Let's add some sample submissions for the completed software links!
-- Again, you need real platform IDs, user IDs, etc.

-- Example structure for submissions (replace IDs!):
--
-- INSERT INTO public.feedback_submissions (user_id, platform_id, status, completion_percentage, amount_earned)
-- VALUES
--   ('USER1_UUID', 'SOFTWARE1_ID', 'approved', 100, 1820),
--   ('USER2_UUID', 'SOFTWARE1_ID', 'approved', 100, 1820),
--   ('USER3_UUID', 'SOFTWARE1_ID', 'approved', 100, 1820),
--   ('USER4_UUID', 'SOFTWARE1_ID', 'approved', 100, 1820),
--   ('USER5_UUID', 'SOFTWARE1_ID', 'approved', 100, 1820);

-- ============================================================================
-- PART 7: INSERT COMPANY PAYMENTS & USER PAYMENTS
-- ============================================================================
-- Company payments for verification and job funding!

-- Uncomment and update:
--
-- INSERT INTO public.company_payments (company_id, amount, payment_method, payment_reference, status, type)
-- VALUES
--   ('COMPANY1_UUID', 1300, 'MPESA', 'REF-TC123', 'success', 'verification'),
--   ('COMPANY1_UUID', 18200, 'MPESA', 'REF-TC456', 'success', 'job'),
--   ('COMPANY2_UUID', 1300, 'MPESA', 'REF-IH789', 'success', 'verification'),
--   ('COMPANY2_UUID', 25480, 'MPESA', 'REF-IH012', 'success', 'job');

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- ============================================================================
-- END OF SEED FILE
-- ============================================================================
-- Instructions:
-- 1. First, create all 12 users (2 companies + 10 users) in Supabase Auth dashboard
--    - Password for all demo users: Password123!
-- 2. Get their UUIDs from Supabase Auth
-- 3. Update this file with real UUIDs
-- 4. Run the INSERT statements in Supabase SQL Editor!
