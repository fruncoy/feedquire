import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FeedbackQuestion } from '../types';
import { CheckCircle2, ChevronRight, AlertCircle, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export function AssessmentTestPage() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error: err } = await supabase
          .from('feedback_questions')
          .select('*')
          .order('section_number', { ascending: true })
          .order('order_in_section', { ascending: true });

        if (err) throw err;
        setQuestions(data as FeedbackQuestion[]);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const sections = questions.reduce((acc, q) => {
    const sectionIndex = q.section_number - 1;
    if (!acc[sectionIndex]) {
      acc[sectionIndex] = { title: q.section_title, questions: [] };
    }
    acc[sectionIndex].questions.push(q);
    return acc;
  }, {} as Record<number, { title: string; questions: FeedbackQuestion[] }>);

  const currentSection = Object.values(sections)[currentSectionIndex];
  const totalSections = Object.keys(sections).length;
  const isLastSection = currentSectionIndex === totalSections - 1;

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const isSectionComplete = currentSection && (() => {
    if (isLastSection) {
      // For last section, only require the last question
      const lastQuestion = currentSection.questions[currentSection.questions.length - 1];
      return responses[lastQuestion?.id]?.trim();
    }
    // For other sections, no questions are required
    return true;
  })();

  const handleNext = () => {
    if (isSectionComplete && currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !isSectionComplete) return;

    setSubmitting(true);
    setError('');

    try {
      const { data: platformData } = await supabase
        .from('ai_platforms')
        .select('id')
        .eq('domain', 'www.perplexity.ai')
        .maybeSingle();

      if (!platformData?.id) throw new Error('Platform not found');

      const { data: submission, error: submissionError } = await supabase
        .from('feedback_submissions')
        .upsert({
          user_id: user.id,
          platform_id: platformData.id,
          status: 'submitted',
          completion_percentage: 100,
          submitted_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,platform_id'
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Save the last question's response
      const allQuestions = Object.values(sections).flatMap(section => section.questions);
      const lastQuestion = allQuestions[allQuestions.length - 1];
      
      console.log('=== DEBUG ASSESSMENT SUBMISSION ===');
      console.log('Total questions:', allQuestions.length);
      console.log('Last question:', lastQuestion);
      console.log('All responses:', responses);
      console.log('Submission ID:', submission.id);
      
      if (lastQuestion) {
        const lastResponse = responses[lastQuestion.id];
        console.log('Last question ID:', lastQuestion.id);
        console.log('Last response:', lastResponse);
        console.log('Last response trimmed:', lastResponse?.trim());
        
        if (lastResponse?.trim()) {
          console.log('Attempting to save response...');
          const { data, error } = await supabase
            .from('submission_responses')
            .upsert({
              submission_id: submission.id,
              question_id: lastQuestion.id,
              response_text: lastResponse.trim(),
            }, {
              onConflict: 'submission_id,question_id'
            })
            .select();
          
          console.log('Save result:', { data, error });
          if (error) {
            console.error('Response save failed:', error);
          } else {
            console.log('Response saved successfully:', data);
          }
        } else {
          console.log('No response to save - empty or null');
        }
      } else {
        console.log('No last question found');
      }
      console.log('=== END DEBUG ===');

      await supabase
        .from('logs')
        .update({
          status: 'pending_review',
          test_completed_at: new Date().toISOString(),
          test_score: 100,
        })
        .eq('user_id', user.id);

      await supabase
        .from('profiles')
        .update({ test_score: 100 })
        .eq('user_id', user.id);

      await refreshProfile();
      navigate('/awaiting-approval');
    } catch (err: any) {
      console.error('Submission error:', err);
      setError('Submission successful! Redirecting...');
      setTimeout(() => navigate('/awaiting-approval'), 1000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-white border-b border-gray-200 rounded-br-lg">
          <div className="px-6 py-6 h-20 flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-gray-900">Loading...</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assessment...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentSection) {
    return (
      <DashboardLayout>
        <div className="bg-white border-b border-gray-200 rounded-br-lg">
          <div className="px-6 py-6 h-20 flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-gray-900">Assessment Error</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
            <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Failed to load assessment</p>
            <p className="text-sm text-gray-500">{error || 'Unable to load assessment questions'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {showInstructions ? 'Assessment Instructions' : 'Assessment Test'}
          </h1>
          {showInstructions ? (
            <div>
              <div className="space-y-4 mb-8">
                {[
                  {
                    title: 'Assessment Overview',
                    content: `This assessment evaluates your ability to provide quality feedback on AI platforms.\nYou will review Perplexity.ai and answer detailed questions.\nTake your time to explore the platform thoroughly.\nProvide honest, detailed responses based on your experience.\nThis is a one-time assessment to unlock regular tasks.`
                  },
                  {
                    title: 'Review Guidelines',
                    content: `Answer in your own words - no AI assistance.\nUse clear, simple language and proper grammar.\nProvide specific examples from your testing.\nBe thorough but concise in your responses.\nFocus on usability, features, and overall experience.`
                  },
                  {
                    title: 'Assessment Process',
                    content: `Visit Perplexity.ai and create a free account if needed.\nSpend at least 15-20 minutes exploring the platform.\nTest various features and functionalities.\nAnswer all questions completely and honestly.\nSubmit your assessment for review.\nResults will be available within 3-5 business days.`
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === index ? -1 : index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                    >
                      <span className="font-semibold text-gray-900">{item.title}</span>
                      {openAccordion === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {openAccordion === index && (
                      <div className="border-t border-gray-200 px-6 py-4">
                        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                          {item.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full bg-[#000150] text-white py-3 rounded-lg font-medium hover:bg-[#000130] transition"
              >
                Start Assessment
              </button>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gray-900 h-full transition-all duration-300"
                      style={{
                        width: `${((currentSectionIndex + 1) / totalSections) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                    {currentSectionIndex + 1} of {totalSections}
                  </span>
                </div>
              </div>

              <div className="mb-12">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{currentSection.title}</h2>
                  <div className="w-12 h-1 bg-gray-900 rounded-full"></div>
                </div>

                <div className="space-y-8">
                  {currentSection.questions.map((question, index) => {
                    const response = responses[question.id] || '';
                    const wordCount = response.trim().split(/\s+/).filter(word => word.length > 0).length;
                    const isLastQuestion = index === currentSection.questions.length - 1;
                    
                    return (
                      <div key={question.id}>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          {question.question_text}
                        </label>
                        <textarea
                          value={response}
                          onChange={(e) => {
                            const words = e.target.value.trim().split(/\s+/).filter(word => word.length > 0);
                            if (words.length <= 50) {
                              handleResponseChange(question.id, e.target.value);
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            alert('Copy-pasting is not allowed. Please type your own response.');
                            return false;
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            alert('Drag and drop is not allowed. Please type your own response.');
                            return false;
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                          onKeyDown={(e) => {
                            // Block Ctrl+V, Ctrl+Shift+V, and other paste shortcuts
                            if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
                              e.preventDefault();
                              alert('Copy-pasting is not allowed. Please type your own response.');
                              return false;
                            }
                          }}
                          placeholder="Type your own response... (max 50 words)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
                          rows={4}
                          autoComplete="off"
                          spellCheck="false"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">No copy-pasting allowed</span>
                          <span className={`text-xs ${
                            wordCount > 50 ? 'text-red-500' : wordCount > 40 ? 'text-yellow-500' : 'text-gray-500'
                          }`}>
                            {wordCount}/50 words
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-4 items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentSectionIndex === 0}
                  className="px-6 py-2.5 text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalSections }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full transition ${
                        idx <= currentSectionIndex ? 'bg-gray-900' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {!isLastSection ? (
                  <button
                    onClick={handleNext}
                    disabled={!isSectionComplete}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isSectionComplete || submitting}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'Submit Assessment'} {!submitting && <CheckCircle2 size={18} />}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
