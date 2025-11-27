create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  );
$$;

-- profiles
alter table public.profiles enable row level security;
create policy profiles_select on public.profiles
  for select using (user_id = auth.uid() or public.is_admin());
create policy profiles_insert on public.profiles
  for insert with check (user_id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy profiles_delete on public.profiles
  for delete using (user_id = auth.uid() or public.is_admin());

-- ai_platforms: readable by all, writable by admins
alter table public.ai_platforms enable row level security;
create policy ai_platforms_select on public.ai_platforms
  for select using (true);
create policy ai_platforms_write on public.ai_platforms
  for all using (public.is_admin()) with check (public.is_admin());

-- feedback_questions: readable by all, writable by admins
alter table public.feedback_questions enable row level security;
create policy feedback_questions_select on public.feedback_questions
  for select using (true);
create policy feedback_questions_write on public.feedback_questions
  for all using (public.is_admin()) with check (public.is_admin());

-- feedback_submissions: owners and admins
alter table public.feedback_submissions enable row level security;
create policy feedback_submissions_select on public.feedback_submissions
  for select using (user_id = auth.uid() or public.is_admin());
create policy feedback_submissions_insert on public.feedback_submissions
  for insert with check (user_id = auth.uid() or public.is_admin());
create policy feedback_submissions_update on public.feedback_submissions
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy feedback_submissions_delete on public.feedback_submissions
  for delete using (user_id = auth.uid() or public.is_admin());

-- submission_responses: owners via submission or admins
alter table public.submission_responses enable row level security;
create policy submission_responses_select on public.submission_responses
  for select using (
    public.is_admin() or exists (
      select 1 from public.feedback_submissions s
      where s.id = submission_id and s.user_id = auth.uid()
    )
  );
create policy submission_responses_insert on public.submission_responses
  for insert with check (
    public.is_admin() or exists (
      select 1 from public.feedback_submissions s
      where s.id = submission_id and s.user_id = auth.uid()
    )
  );
create policy submission_responses_update on public.submission_responses
  for update using (
    public.is_admin() or exists (
      select 1 from public.feedback_submissions s
      where s.id = submission_id and s.user_id = auth.uid()
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.feedback_submissions s
      where s.id = submission_id and s.user_id = auth.uid()
    )
  );
create policy submission_responses_delete on public.submission_responses
  for delete using (
    public.is_admin() or exists (
      select 1 from public.feedback_submissions s
      where s.id = submission_id and s.user_id = auth.uid()
    )
  );

-- platform_assignments: owners and admins
alter table public.platform_assignments enable row level security;
create policy platform_assignments_select on public.platform_assignments
  for select using (user_id = auth.uid() or public.is_admin());
create policy platform_assignments_insert on public.platform_assignments
  for insert with check (user_id = auth.uid() or public.is_admin());
create policy platform_assignments_update on public.platform_assignments
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy platform_assignments_delete on public.platform_assignments
  for delete using (user_id = auth.uid() or public.is_admin());

-- user_assessments: owners and admins
alter table public.user_assessments enable row level security;
create policy user_assessments_select on public.user_assessments
  for select using (user_id = auth.uid() or public.is_admin());
create policy user_assessments_insert on public.user_assessments
  for insert with check (user_id = auth.uid() or public.is_admin());
create policy user_assessments_update on public.user_assessments
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy user_assessments_delete on public.user_assessments
  for delete using (user_id = auth.uid() or public.is_admin());
