create extension if not exists "pgcrypto";
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null,
  verification_status text not null default 'pending',
  payment_status text not null default 'unverified',
  account_status text not null default 'pending',
  instasend_payment_id text null,
  test_score integer not null default 0,
  total_earned numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('user','admin'))
);
create index if not exists idx_profiles_user_id on public.profiles(user_id);

create table if not exists public.ai_platforms (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  description text not null,
  amount_per_submission numeric(12,2) not null default 0,
  status text not null default 'active',
  total_interested integer not null default 0,
  total_completed integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists uq_ai_platforms_domain on public.ai_platforms(domain);
create index if not exists idx_ai_platforms_status on public.ai_platforms(status);

create table if not exists public.feedback_questions (
  id uuid primary key default gen_random_uuid(),
  section_number integer not null,
  section_title text not null,
  question_text text not null,
  question_type text not null,
  order_in_section integer not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_feedback_questions_section on public.feedback_questions(section_number, order_in_section);

create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform_id uuid not null references public.ai_platforms(id) on delete cascade,
  status text not null default 'pending',
  completion_percentage integer not null default 0,
  amount_earned numeric(12,2) not null default 0,
  rejection_reason text null,
  submitted_at timestamptz null,
  approved_at timestamptz null,
  paid_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feedback_submissions_completion_check check (
    completion_percentage >= 0 and completion_percentage <= 100
  )
);
create index if not exists idx_feedback_submissions_user on public.feedback_submissions(user_id);
create index if not exists idx_feedback_submissions_platform on public.feedback_submissions(platform_id);
create index if not exists idx_feedback_submissions_status on public.feedback_submissions(status);

create table if not exists public.submission_responses (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.feedback_submissions(id) on delete cascade,
  question_id uuid not null references public.feedback_questions(id) on delete cascade,
  response_text text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_submission_responses_submission on public.submission_responses(submission_id);
create index if not exists idx_submission_responses_question on public.submission_responses(question_id);

create table if not exists public.platform_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform_id uuid not null references public.ai_platforms(id) on delete cascade,
  status text not null default 'assigned',
  assigned_at timestamptz not null default now(),
  constraint uq_platform_assignments_user_platform unique (user_id, platform_id)
);
create index if not exists idx_platform_assignments_user on public.platform_assignments(user_id);
create index if not exists idx_platform_assignments_platform on public.platform_assignments(platform_id);
create index if not exists idx_platform_assignments_status on public.platform_assignments(status);

create table if not exists public.user_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  payment_verified_at timestamptz null,
  test_started_at timestamptz null,
  test_completed_at timestamptz null,
  test_score integer not null default 0,
  approval_notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_user_assessments_user on public.user_assessments(user_id);
create index if not exists idx_user_assessments_status on public.user_assessments(status);
