import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FeedbackSubmission, AIPlatform, SubmissionResponse, FeedbackQuestion } from '../types';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';

interface SubmissionWithDetails {
  submission: FeedbackSubmission;
  platform: AIPlatform;
  responses: SubmissionResponse[];
  questions: Record<string, FeedbackQuestion>;
}

export function AdminSubmissionsPage() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithDetails | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('feedback_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      const enrichedSubmissions: SubmissionWithDetails[] = [];

      for (const submission of submissionsData || []) {
        const { data: platformData } = await supabase
          .from('ai_platforms')
          .select('*')
          .eq('id', submission.platform_id)
          .maybeSingle();

        const { data: responsesData } = await supabase
          .from('submission_responses')
          .select('*')
          .eq('submission_id', submission.id);

        const { data: questionsData } = await supabase
          .from('feedback_questions')
          .select('*');

        const questionsMap: Record<string, FeedbackQuestion> = {};
        questionsData?.forEach(q => {
          questionsMap[q.id] = q;
        });

        enrichedSubmissions.push({
          submission,
          platform: platformData as AIPlatform,
          responses: responsesData || [],
          questions: questionsMap,
        });
      }

      setSubmissions(enrichedSubmissions);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    setUpdating(true);
    try {
      const sub = submissions.find(s => s.submission.id === submissionId)?.submission;
      if (!sub) return;

      const { error } = await supabase
        .from('feedback_submissions')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          amount_earned: sub.platform_id ? submissions.find(s => s.submission.id === submissionId)?.platform.amount_per_submission : 0,
        })
        .eq('id', submissionId);

      if (error) throw error;
      await fetchSubmissions();
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error approving submission:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (submissionId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({
          status: 'rejected',
          rejection_reason: reason,
        })
        .eq('id', submissionId);

      if (error) throw error;
      await fetchSubmissions();
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error rejecting submission:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkPaid = async (submissionId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (error) throw error;

      const sub = submissions.find(s => s.submission.id === submissionId);
      if (sub) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('total_earned')
          .eq('user_id', sub.submission.user_id)
          .maybeSingle();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              total_earned: (profile.total_earned || 0) + (sub.submission.amount_earned || 0),
            })
            .eq('user_id', sub.submission.user_id);
        }
      }

      await fetchSubmissions();
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error marking paid:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-6 h-20 flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-gray-900">Loading...</h1>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (selectedSubmission) {
    return (
      <DashboardLayout>
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-6 h-20 flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-gray-900">Submission Details</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedSubmission(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ChevronLeft size={18} />
            Back to Submissions
          </button>

          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {selectedSubmission.platform.domain}
                </h2>
                <p className="text-gray-600">
                  Status: <span className="font-semibold capitalize">{selectedSubmission.submission.status}</span>
                </p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                selectedSubmission.submission.status === 'submitted'
                  ? 'bg-blue-50 text-blue-700'
                  : selectedSubmission.submission.status === 'approved'
                  ? 'bg-green-50 text-green-700'
                  : selectedSubmission.submission.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-50 text-red-700'
              }`}>
                {selectedSubmission.submission.status}
              </span>
            </div>
          </div>

          <div className="space-y-8 mb-12">
            {selectedSubmission.responses.map((response) => {
              const question = selectedSubmission.questions[response.question_id];
              return (
                <div key={response.id}>
                  <h4 className="font-semibold text-gray-900 mb-3">{question?.question_text}</h4>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{response.response_text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedSubmission.submission.status === 'submitted' && (
            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(selectedSubmission.submission.id)}
                disabled={updating}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                {updating ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => handleReject(selectedSubmission.submission.id)}
                disabled={updating}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                {updating ? 'Processing...' : 'Reject'}
              </button>
            </div>
          )}

          {selectedSubmission.submission.status === 'approved' && (
            <button
              onClick={() => handleMarkPaid(selectedSubmission.submission.id)}
              disabled={updating}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {updating ? 'Processing...' : 'Mark as Paid'}
            </button>
          )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-6 h-20 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">Review Submissions</h1>
        </div>
      </div>
      <div className="p-6">

        <div className="space-y-2">
          {submissions.map((item) => (
            <button
              key={item.submission.id}
              onClick={() => setSelectedSubmission(item)}
              className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{item.platform.domain}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.submission.status === 'submitted'
                    ? 'bg-blue-50 text-blue-700'
                    : item.submission.status === 'approved'
                    ? 'bg-green-50 text-green-700'
                    : item.submission.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {item.submission.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                ${item.submission.amount_earned?.toFixed(2) || item.platform.amount_per_submission.toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
