import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FeedbackSubmission, AIPlatform, SubmissionResponse, FeedbackQuestion } from '../types';
import { ChevronLeft, CheckCircle2, XCircle, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';

interface SubmissionWithDetails {
  submission: FeedbackSubmission;
  platform: AIPlatform;
  responses: SubmissionResponse[];
  questions: Record<string, FeedbackQuestion>;
  userName: string;
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

        const { data: userData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', submission.user_id)
          .maybeSingle();

        const questionsMap: Record<string, FeedbackQuestion> = {};
        questionsData?.forEach(q => {
          questionsMap[q.id] = q;
        });

        enrichedSubmissions.push({
          submission,
          platform: platformData as AIPlatform,
          responses: responsesData || [],
          questions: questionsMap,
          userName: userData?.full_name || 'Unknown User',
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
      const sub = submissions.find(s => s.submission.id === submissionId);
      if (!sub) return;

      const { error } = await supabase
        .from('feedback_submissions')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          amount_earned: sub.platform.amount_per_submission,
        })
        .eq('id', submissionId);

      if (error) throw error;

      // If this is an assessment submission, promote user to Tier 3
      if (sub.platform.is_assessment) {
        await supabase
          .from('profiles')
          .update({
            account_status: '2hF2kQ7rD5xVfM1tZ',
          })
          .eq('user_id', sub.submission.user_id);
      }

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
            <h1 className="text-2xl font-semibold text-gray-900">Review Submissions</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
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
            <div
              key={item.submission.id}
              className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.platform.domain} <span className="text-sm text-gray-600 font-normal">by {item.userName}</span></h3>
                </div>
                <div className="flex items-center gap-3">
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
                  {item.submission.status === 'submitted' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item.submission.id)}
                        disabled={updating}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                        title="Approve"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        onClick={() => handleReject(item.submission.id)}
                        disabled={updating}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                        title="Reject"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                  {item.submission.status === 'approved' && (
                    <button
                      onClick={() => handleMarkPaid(item.submission.id)}
                      disabled={updating}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                      title="Mark as Paid"
                    >
                      <DollarSign size={16} />
                    </button>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
