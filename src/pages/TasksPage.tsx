
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { supabase } from '../lib/supabase';
import { sendNewTasksEmailToAll } from '../lib/email';
import { AIPlatform, FeedbackSubmission, Profile } from '../types';
import { ChevronRight, CheckCircle2, Mail, X } from 'lucide-react';
import { MetaPixelEvents } from '../lib/metaPixel';

export function TasksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { features, validateTaskAccess } = usePermissions();
  const [platforms, setPlatforms] = useState<Record<string, AIPlatform>>({});
  const [submissions, setSubmissions] = useState<Record<string, FeedbackSubmission>>({});
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      if (!user) return;

      // Fetch active tasks
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

      // Fetch user submissions
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

      // If user is admin, fetch all users for email count
      if (features.admin) {
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .neq('role', 'admin')
          .neq('role', 'system_operator');
        if (!usersError) {
          setUsers(usersData || []);
        }
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmails = async () => {
    setSendingEmails(true);
    try {
      const result = await sendNewTasksEmailToAll();
      alert(`Emails sent successfully! Sent to ${result.sentEmailsCount} users.`);
      setShowEmailModal(false);
    } catch (err) {
      console.error('Error sending emails:', err);
      alert('Error sending emails');
    } finally {
      setSendingEmails(false);
    }
  };

  const handleStartTask = async (platformId: string) => {
    const submission = submissions[platformId];
    if (submission) {
      return;
    }
    
    const platform = platforms[platformId];
    if (platform) {
      MetaPixelEvents.taskStarted(platform.domain, platform.amount_per_submission);
      MetaPixelEvents.viewContent(`Task: ${platform.domain}`, 'task', platform.amount_per_submission);
    }
    
    const canAccess = await validateTaskAccess(platformId);
    if (canAccess) {
      navigate(`/feedback/${platformId}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Admin: Send New Tasks Email Button */}
        {features.admin && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Mail size={18} />
              Send New Tasks Email
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        ) : Object.keys(platforms).filter(id => !submissions[id]).length === 0 ? (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
              <p className="text-base text-gray-600">Check back soon for more tasks</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {Object.values(platforms).map((platform) => {
              const submission = submissions[platform.id];
              if (!platform || submission) return null;

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
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{platform.domain}</h3>
                      <p className="text-gray-600 text-sm">{platform.description}</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <ChevronRight size={24} className="text-gray-400" />
                    </div>
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

      {/* Send New Tasks Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Send New Tasks Email</h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-600">This will send an email to all users with the currently active tasks from the system.</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEmailModal(false)}
                disabled={sendingEmails}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmails}
                disabled={sendingEmails}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Mail size={16} />
                {sendingEmails ? 'Sending...' : `Send to ${users.filter(u => u.email).length} Users`}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
