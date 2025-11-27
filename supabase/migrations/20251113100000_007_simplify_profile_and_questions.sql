-- Remove verification_status and payment_status columns from profiles
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS verification_status,
DROP COLUMN IF EXISTS payment_status;

-- Clear existing feedback questions
DELETE FROM public.feedback_questions;

-- Insert the new feedback questions
INSERT INTO public.feedback_questions (section_number, section_title, question_text, question_type, order_in_section) VALUES
-- Section 1: First Impressions
(1, 'First Impressions', 'How easy was it to start using this AI (from signup to first result)?', 'textarea', 1),
(1, 'First Impressions', 'What was your immediate impression of its design, interface, and clarity?', 'textarea', 2),

-- Section 2: Experience & Use
(2, 'Experience & Use', 'Describe one specific task you used this AI for. How well did it perform?', 'textarea', 1),
(2, 'Experience & Use', 'Did the AI understand your instructions clearly, or did you have to rephrase a lot?', 'textarea', 2),
(2, 'Experience & Use', 'What part of the experience felt most natural — and what felt frustrating or confusing?', 'textarea', 3),

-- Section 3: Output & Quality
(3, 'Output & Quality', 'How accurate, useful, or original were the AI''s results?', 'textarea', 1),
(3, 'Output & Quality', 'If you''ve used similar tools, how does this one compare in quality or creativity?', 'textarea', 2),
(3, 'Output & Quality', 'Did you notice any biases, errors, or weird responses? Give an example.', 'textarea', 3),

-- Section 4: Value & Trust
(4, 'Value & Trust', 'Would you personally use or subscribe to this AI long-term? Why or why not?', 'textarea', 1),
(4, 'Value & Trust', 'If you were an investor, would you consider funding this AI company? Explain your reasoning.', 'textarea', 2),
(4, 'Value & Trust', 'What type of user or business do you think would benefit the most from this AI?', 'textarea', 3),

-- Section 5: Overall Impact
(5, 'Overall Impact', 'In one sentence, what''s your honest verdict on this AI? (e.g., "Worth paying for," "Still needs work," "Game-changer," etc.)', 'textarea', 1);

-- Update existing profiles to use tier1 as default
UPDATE public.profiles SET account_status = 'tier1' WHERE account_status NOT IN ('tier1', 'tier2', 'tier3', 'rejected', 'banned');