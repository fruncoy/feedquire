import { DashboardLayout } from '../components/DashboardLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FeedbackSubmission, AIPlatform } from '../types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export function SubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);
  const [platforms, setPlatforms] = useState<Record<string, AIPlatform>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchSubmissions();
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      const { data: submissionData, error: submissionError } = await supabase
        .from('feedback_submissions')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false });

      if (submissionError) throw submissionError;
      setSubmissions(submissionData as FeedbackSubmission[]);

      if (submissionData && submissionData.length > 0) {
        const platformIds = [...new Set(submissionData.map(s => s.platform_id))];
        const { data: platformData, error: platformError } = await supabase
          .from('ai_platforms')
          .select('*')
          .in('id', platformIds);

        if (platformError) throw platformError;

        const platformMap: Record<string, AIPlatform> = {};
        platformData?.forEach(p => {
          platformMap[p.id] = p as AIPlatform;
        });
        setPlatforms(platformMap);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (submission: FeedbackSubmission, platform: AIPlatform) => {
    if (platform?.is_assessment) {
      return submission.status === 'approved' ? 'Qualified' : submission.status === 'rejected' ? 'Not Qualified' : 'Under Review';
    }
    return submission.status === 'approved' ? 'Qualified' : submission.status === 'rejected' ? 'Not Qualified' : 'Under Review';
  };

  const getStatusIcon = (submission: FeedbackSubmission) => {
    if (submission.status === 'approved') return <CheckCircle2 size={16} className="text-green-600" />;
    if (submission.status === 'rejected') return <XCircle size={16} className="text-red-600" />;
    return <Clock size={16} className="text-orange-600" />;
  };

  const getStatusColor = (submission: FeedbackSubmission) => {
    if (submission.status === 'approved') return 'bg-green-50 text-green-700';
    if (submission.status === 'rejected') return 'bg-red-50 text-red-700';
    return 'bg-orange-50 text-orange-700';
  };

  return (
    <DashboardLayout>


      <div className="p-6">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No submissions yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => {
              const platform = platforms[submission.platform_id];
              if (!platform) return null;

              return (
                <div key={submission.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {platform.is_assessment ? 'Assessment Test' : platform.domain}
                        </h3>
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(submission)}`}>
                          {getStatusIcon(submission)}
                          {getStatusDisplay(submission, platform)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {platform.is_assessment ? 'Assessment test submission' : platform.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Submitted: {new Date(submission.created_at).toLocaleDateString()}</span>
                        {submission.amount_earned > 0 && (
                          <span className="font-medium text-green-600">${submission.amount_earned.toFixed(2)} earned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}