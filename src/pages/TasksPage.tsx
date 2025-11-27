import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { supabase } from '../lib/supabase';
import { AIPlatform, FeedbackSubmission } from '../types';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

export function TasksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { features, validateTaskAccess } = usePermissions();
  const [platforms, setPlatforms] = useState<Record<string, AIPlatform>>({});
  const [submissions, setSubmissions] = useState<Record<string, FeedbackSubmission>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user) return;

      const { data: platformData, error: platformError } = await supabase
        .from('ai_platforms')
        .select('*')
        .eq('status', 'active');

      if (platformError) throw platformError;

      const platformMap: Record<string, AIPlatform> = {};
      platformData?.filter(p => !p.is_assessment).forEach(p => {
        platformMap[p.id] = p as AIPlatform;
      });
      setPlatforms(platformMap);

      const { data: submissionData, error: submissionError } = await supabase
        .from('feedback_submissions')
        .select('*')
        .eq('user_id', user.id);

      if (submissionError) throw submissionError;

      const submissionMap: Record<string, FeedbackSubmission> = {};
      submissionData?.forEach(s => {
        submissionMap[s.platform_id] = s as FeedbackSubmission;
      });
      setSubmissions(submissionMap);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async (platformId: string) => {
    const canAccess = await validateTaskAccess(platformId);
    if (canAccess) {
      navigate(`/feedback/${platformId}`);
    }
  };

  return (
    <DashboardLayout>


      <div className="p-6">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        ) : Object.keys(platforms).length === 0 ? (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-2">No tasks assigned yet</p>
            <p className="text-sm text-gray-500">
              {!features.tasks
                ? 'Get approved to unlock tasks'
                : 'Check back soon for new AI platforms'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {Object.values(platforms).map((platform) => {
              const submission = submissions[platform.id];
              if (!platform) return null;

              const isCompleted = submission?.status === 'paid';

              return (
                <button
                  key={platform.id}
                  onClick={() => features.tasks ? handleStartTask(platform.id) : null}
                  className={`w-full bg-white border border-gray-200 rounded-lg p-6 transition text-left ${
                    features.tasks ? 'hover:border-gray-300 hover:shadow-md cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!features.tasks}
                >
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-6 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{platform.domain}</h3>
                          {isCompleted && (
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
                              <CheckCircle2 size={14} /> Paid
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{platform.description}</p>
                      </div>
                      
                      {!isCompleted && (
                        <div className="flex-shrink-0">
                          <ChevronRight size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end items-center gap-3">
                      <span className="text-sm font-bold text-black">payout</span>
                      <span className="rounded-full px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-sm">${platform.amount_per_submission.toFixed(2)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (features.tasks) handleStartTask(platform.id);
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                          features.tasks 
                            ? 'bg-[#000150] text-white hover:bg-[#000130] cursor-pointer' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!features.tasks}
                      >
                        Start Task
                      </button>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
