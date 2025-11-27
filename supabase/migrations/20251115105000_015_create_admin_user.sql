-- Create admin user directly
-- Since signup might have issues, let's create a simple approach:
-- Admin should sign up normally at /login first with admin@gmail.com
-- Then run this to make them admin:

-- UPDATE profiles SET role = 'admin' 
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');

-- Alternative: Admin can sign up at /login, then we update their role manually