-- 20260610_add_all_rls_policies_for_demo.sql
-- Temporary RLS policies for demo purposes (allow all authenticated users to read everything)

-- Enable RLS on all tables just in case they're not enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to SELECT from all tables
CREATE POLICY "Enable read access for authenticated users" ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable read access for authenticated users" ON companies FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable read access for authenticated users" ON software_links FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable read access for authenticated users" ON company_payments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable read access for authenticated users" ON feedback_submissions FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow all authenticated users to INSERT/UPDATE/DELETE (for demo purposes)
CREATE POLICY "Enable all access for authenticated users" ON profiles FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all access for authenticated users" ON companies FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all access for authenticated users" ON software_links FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all access for authenticated users" ON company_payments FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all access for authenticated users" ON feedback_submissions FOR ALL USING (auth.uid() IS NOT NULL);