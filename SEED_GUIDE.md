
# Feedquire Demo Seed Guide

This guide will help you set up demo data for Feedquire:
- 2 Verified Companies
- 10 Kenyan Test Users
- Demo Software, Payments, and Submissions!

---

## Prerequisites
- You must have:
1. A Supabase project set up and environment variables configured in `.env`
2. Supabase CLI installed (optional but helpful)

---

## Step 1: Get Your Supabase Service Role Key

1. Go to your Supabase Dashboard → Project Settings → API
2. Copy your **service_role** secret key (NOT the anon key!)
3. Keep this safe!

---

## Step 2: Create the Demo Users

We'll use the Supabase Dashboard for this (since the Admin API requires service role):

### Companies (Password for all demo accounts: `Password123!`

Create these users in **Supabase Auth → Users → Add User:

### 1. Company 1: TechSolutions Kenya
   - Email: `techsolutions@example.com`
   - Password: `Password123!`

### 2. Company 2: InnovateHub Africa
   - Email: `innovatehub@example.com`
   - Password: `Password123!`

### 3. Grace Wanjiru - `wanjiru@example.com`
### 4. James Otieno - `otieno@example.com`
### 5. Amina Auma - `auma@example.com`
### 6. Peter Kariuki - `kariuki@example.com`
### 7. Lucy Mwangi - `mwangi@example.com`
### 8. David Chebet - `chebet@example.com`
### 9. Esther Omondi - `omondi@example.com`
### 10. Joseph Mutua - `mutua@example.com`
### 11. Sarah Juma - `juma@example.com`
### 12. Michael Ndemo - `ndemo@example.com`

---

## Step 3: Get User UUIDs

For each user you just created, copy their `User UUID` from the Auth dashboard!

---

## Step 4: Run the SQL Seed SQL in Supabase SQL Editor

Copy the SQL from `supabase/seed.sql`, replace all placeholders with real UUIDs:

Then run in Supabase Dashboard → SQL Editor → New Query!

1. Replace these placeholders with real UUIDs:
- `YOUR_COMPANY1_USER_UUID_HERE
- `YOUR_COMPANY2_USER_UUID_HERE
- `USER1_UUID` to `USER10_UUID`
- `COMPANY1_UUID_HERE`, etc.

---

## Step 5: Verify Seed is Complete!

Now you can log in with any of the demo accounts!

---

## Demo User Credentials
- Company 1: techsolutions@example.com / Password123!
- Company 2: innovatehub@example.com / Password123!
- Test Users: wanjiru@example.com / Password123! (and all the others!)
