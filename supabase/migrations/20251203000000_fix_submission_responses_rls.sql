-- Drop existing policies on submission_responses
drop policy if exists submission_responses_select on public.submission_responses;
drop policy if exists submission_responses_insert on public.submission_responses;
drop policy if exists submission_responses_update on public.submission_responses;
drop policy if exists submission_responses_delete on public.submission_responses;

-- Create simpler policies that avoid recursion
create policy submission_responses_select on public.submission_responses
  for select using (
    exists (
      select 1 from public.feedback_submissions s
      where s.id = submission_responses.submission_id 
      and s.user_id = auth.uid()
    )
    or
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() 
      and p.role = 'admin'
    )
  );

create policy submission_responses_insert on public.submission_responses
  for insert with check (
    exists (
      select 1 from public.feedback_submissions s
      where s.id = submission_responses.submission_id 
      and s.user_id = auth.uid()
    )
    or
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() 
      and p.role = 'admin'
    )
  );

create policy submission_responses_update on public.submission_responses
  for update using (
    exists (
      select 1 from public.feedback_submissions s
      where s.id = submission_responses.submission_id 
      and s.user_id = auth.uid()
    )
    or
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() 
      and p.role = 'admin'
    )
  );

create policy submission_responses_delete on public.submission_responses
  for delete using (
    exists (
      select 1 from public.feedback_submissions s
      where s.id = submission_responses.submission_id 
      and s.user_id = auth.uid()
    )
    or
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() 
      and p.role = 'admin'
    )
  );
