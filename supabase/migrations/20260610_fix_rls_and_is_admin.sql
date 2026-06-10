
-- Fix RLS policies for demo!

-- Update is_admin function to recognize both 'admin' and 'system_operator'
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and (p.role = 'admin' or p.role = 'system_operator')
  );
$$;

-- Add RLS for companies table!
alter table public.companies enable row level security;
create policy companies_select on public.companies
  for select using (user_id = auth.uid() or public.is_admin());
create policy companies_insert on public.companies
  for insert with check (user_id = auth.uid() or public.is_admin());
create policy companies_update on public.companies
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy companies_delete on public.companies
  for delete using (user_id = auth.uid() or public.is_admin());

-- Add RLS for software_links table!
alter table public.software_links enable row level security;
create policy software_links_select on public.software_links
  for select using (
    public.is_admin() or exists (
      select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid()
    )
  );
create policy software_links_insert on public.software_links
  for insert with check (
    public.is_admin() or exists (
      select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid()
    )
  );
create policy software_links_update on public.software_links
  for update using (
    public.is_admin() or exists (
      select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid()
    )
  );
create policy software_links_delete on public.software_links
  for delete using (
    public.is_admin() or exists (
      select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid()
    )
  );

-- Add RLS for company_payments table!
alter table public.company_payments enable row level security;
create policy company_payments_select on public.company_payments
  for select using (
    public.is_admin() or exists (
      select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid()
    )
  );
create policy company_payments_insert on public.company_payments
  for insert with check (
    public.is_admin() or exists (
      select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid()
    )
  );
create policy company_payments_update on public.company_payments
  for update using (
    public.is_admin() or exists (
      select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid()
    )
  );
create policy company_payments_delete on public.company_payments
  for delete using (
    public.is_admin() or exists (
      select 1 from public.companies c where c.id = company_id and c.user_id = auth.uid()
    )
  );
