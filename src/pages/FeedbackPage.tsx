import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AIPlatform, FeedbackQuestion, FeedbackSubmission } from '../types';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export function FeedbackPage() {
  const { platformId } = useParams<{ platformId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [platform, setPlatform] = useState<AIPlatform | null>(null);
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [submission, setSubmission] = useState<FeedbackSubmission | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(0);

  useEffect(() => {
    if (!user || !platformId) return;
    fetchData();
  }, [user, platformId]);

  const fetchData = async () => {
    try {
      if (!user || !platformId) return;

      const { data: platformData, error: platformError } = await supabase
        .from('ai_platforms')
        .select('*')
        .eq('id', platformId)
        .maybeSingle();

      if (platformError) throw platformError;
      setPlatform(platformData as AIPlatform);

      const { data: questionsData, error: questionsError } = await supabase
        .from('feedback_questions')
        .select('*')
        .order('section_number', { ascending: true })
        .order('order_in_section', { ascending: true });

      if (questionsError) throw questionsError;
      setQuestions(questionsData as FeedbackQuestion[]);

      let { data: submissionData, error: submissionError } = await supabase
        .from('feedback_submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform_id', platformId)
        .maybeSingle();

      if (submissionError) throw submissionError;

      // Don't create submission until final submit

      if (submissionData) {
        setSubmission(submissionData as FeedbackSubmission);
        
        const { data: responsesData, error: responsesError } = await supabase
          .from('submission_responses')
          .select('*')
          .eq('submission_id', submissionData.id);

        if (responsesError) throw responsesError;

        const responseMap: Record<string, string> = {};
        responsesData?.forEach(r => {
          responseMap[r.question_id] = r.response_text;
        });
        setResponses(responseMap);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load feedback form');
    } finally {
      setLoading(false);
    }
  };

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
    const allQuestions = Object.values(sections).flatMap(section => section.questions);
    const lastQuestion = allQuestions[allQuestions.length - 1];
    
    if (isLastSection) {
      // For last section, only require the last question (text input)
      return responses[lastQuestion?.id]?.trim();
    }
    // For other sections, no questions are required (all optional)
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

    try {
      // Create submission
      const { data: newSubmission, error: submissionError } = await supabase
        .from('feedback_submissions')
        .insert({
          user_id: user.id,
          platform_id: platformId,
          status: 'submitted',
          completion_percentage: 100,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Only save the last question's response (like assessment)
      const allQuestions = Object.values(sections).flatMap(section => section.questions);
      const lastQuestion = allQuestions[allQuestions.length - 1];
      const lastResponse = responses[lastQuestion?.id];
      
      if (lastResponse?.trim()) {
        const { error: responseError } = await supabase
          .from('submission_responses')
          .insert({
            submission_id: newSubmission.id,
            question_id: lastQuestion.id,
            response_text: lastResponse,
          });
        
        if (responseError) throw responseError;
      }

      navigate('/pending-approval');
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit feedback');
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
            <p className="text-gray-600 text-sm mt-1">Please wait while we load your task</p>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading feedback form...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!platform) {
    return (
      <DashboardLayout>
        <div className="bg-white border-b border-gray-200 rounded-br-lg">
          <div className="px-6 py-6 h-20 flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-gray-900">Task Not Found</h1>
            <p className="text-gray-600 text-sm mt-1">The requested task could not be found</p>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
            <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Task not found</p>
            <p className="text-sm text-gray-500">This task may have been removed or you don't have access to it</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white border-b border-gray-200 rounded-br-lg">
        <div className="px-6 py-6 h-20 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            {showInstructions ? 'Review Instructions' : platform.domain}
          </h1>

        </div>
      </div>

      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          {showInstructions ? (
            <div>
              <div className="space-y-4 mb-8">
                {[
                  {
                    title: 'Review Standards',
                    content: `Answer in your own words.\nDo not use AI tools to write or edit your answers.\nKeep language clear. Use simple grammar.\nDo not invent features. Write only what you saw and tested.\nGive real examples. Avoid generic text.\nBe honest. Low-effort work gets rejected.`
                  },
                  {
                    title: 'Review Steps',
                    content: `Open your browser or a new tab.\nOpen the website link we provided.\nSign in or start a free trial if needed.\nTake your time. Explore most of the features.\nNote any bugs, odd results, or strong points.\nAnswer all 12 questions in plain text. Use examples.\nCheck your grammar and clarity. Keep it readable.\nSubmit your review.\nWait for admin verification (3–5 days). Check your dashboard for updates.`
                  },
                  {
                    title: 'Payment & Payouts',
                    content: `New tasks appear every new month.\nSubmit reviews before the 30th of each month.\nSubmit once per task. No edits after submitting.\nAdmin checks all reviews regularly.\nFinal results are confirmed by the 5th of the next month.\nYou can withdraw anytime after approval.\nCheck the Submissions page for status updates.`
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
                I Understand
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

              {currentSection && (
                <div className="mb-12">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{currentSection.title}</h2>
                    <div className="w-12 h-1 bg-gray-900 rounded-full"></div>
                  </div>

                  <div className="space-y-8">
                    {currentSection.questions.map((question, index) => {
                      const allQuestions = Object.values(sections).flatMap(section => section.questions);
                      const isLastQuestion = question.id === allQuestions[allQuestions.length - 1]?.id;
                      const response = responses[question.id] || '';
                      const wordCount = response.trim().split(/\s+/).filter(word => word.length > 0).length;
                      
                      return (
                        <div key={question.id}>
                          <label className="block text-sm font-medium text-gray-900 mb-3">
                            {question.question_text}
                          </label>
                          {isLastQuestion ? (
                            <div>
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
                          ) : (
                            <div>
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
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
                    {submitting ? 'Submitting...' : 'Submit Feedback'} {!submitting && <CheckCircle2 size={18} />}
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