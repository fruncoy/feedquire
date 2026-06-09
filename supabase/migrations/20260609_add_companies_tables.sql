
-- Create companies table
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  company_name text not null,
  company_email text not null,
  company_website text,
  verification_status text not null default 'pending',
  payment_status text not null default 'unverified',
  account_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_companies_user_id on public.companies(user_id);

-- Create company_payments table
create table if not exists public.company_payments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  amount numeric(12,2) not null,
  payment_method text,
  payment_reference text,
  status text not null default 'pending',
  type text not null default 'verification', -- verification or job
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_company_payments_company_id on public.company_payments(company_id);

-- Create software_links table (for verified companies to add their own software links
create table if not exists public.software_links (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text not null,
  website text not null,
  total_budget numeric(12,2) not null default 140,
  max_responses integer not null default 10,
  amount_per_submission numeric(12,2) not null,
  optional_clarifications text,
  deadline timestamptz,
  status text not null default 'pending', -- pending, funded, active, completed
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_software_links_company_id on public.software_links(company_id);
