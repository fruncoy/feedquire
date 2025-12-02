import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AIPlatform, FeedbackSubmission } from '../types';
import { Clock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export function PendingApprovalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<(FeedbackSubmission & { platform: AIPlatform })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchSubmissions();
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      if (!user) return;

      const { data: submissionsData, error: submissionsError } = await supabase
        .from('feedback_submissions')
        .select(`
          *,
          ai_platforms (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      setSubmissions(submissionsData || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
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
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your submissions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-6 h-20 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">Task Reviews Pending</h1>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
          >
            <ArrowLeft size={18} />
            Back to Tasks
          </button>

          {submissions.length === 0 ? (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
              <CheckCircle2 size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Reviews</h3>
              <p className="text-gray-600 mb-4">
                You don't have any task submissions waiting for review.
              </p>
              <button
                onClick={() => navigate('/tasks')}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Browse Available Tasks
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Review Timeline</h3>
                    <p className="text-blue-800 text-sm">
                      Task submissions are reviewed monthly. All submissions will be approved or rejected before the 30th of each month.
                      You'll receive notifications once your submissions are processed.
                    </p>
                  </div>
                </div>
              </div>

              <div></div>

              <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-3">What happens next?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Our team reviews all submissions for quality and completeness</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Approved submissions are processed for payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Rejected submissions allow you to work on new tasks immediately</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}