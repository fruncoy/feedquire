-- Fix submission_responses RLS policies to use correct admin role
DROP POLICY IF EXISTS submission_responses_select ON public.submission_responses;
DROP POLICY IF EXISTS submission_responses_insert ON public.submission_responses;
DROP POLICY IF EXISTS submission_responses_update ON public.submission_responses;
DROP POLICY IF EXISTS submission_responses_delete ON public.submission_responses;

-- Create policies with correct admin role
CREATE POLICY submission_responses_select ON public.submission_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.feedback_submissions s
      WHERE s.id = submission_responses.submission_id 
      AND s.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() 
      AND p.role = 'system_operator'
    )
  );

CREATE POLICY submission_responses_insert ON public.submission_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.feedback_submissions s
      WHERE s.id = submission_responses.submission_id 
      AND s.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() 
      AND p.role = 'system_operator'
    )
  );

CREATE POLICY submission_responses_update ON public.submission_responses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.feedback_submissions s
      WHERE s.id = submission_responses.submission_id 
      AND s.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() 
      AND p.role = 'system_operator'
    )
  );

CREATE POLICY submission_responses_delete ON public.submission_responses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.feedback_submissions s
      WHERE s.id = submission_responses.submission_id 
      AND s.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() 
      AND p.role = 'system_operator'
    )
  );