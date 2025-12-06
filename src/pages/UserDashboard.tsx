import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AIPlatform, FeedbackSubmission } from '../types';
import { ChevronRight, Lock } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { DashboardLayout } from '../components/DashboardLayout';
import { WelcomeLetter } from '../components/WelcomeLetter';

export function UserDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { features, loading: permissionsLoading } = usePermissions();
  const [platforms, setPlatforms] = useState<Record<string, AIPlatform>>({});
  const [submissions, setSubmissions] = useState<Record<string, FeedbackSubmission>>({});
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!user) return;
    refreshProfile();
    fetchData();
  }, [user]);

  useEffect(() => {
    if (profile && profile.has_seen_welcome === false) {
      setShowWelcome(true);
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      if (!user) return;

      const { data: platformData, error: platformError } = await supabase
        .from('ai_platforms')
        .select('*')
        .eq('status', 'active');

      if (platformError) throw platformError;

      const platformMap: Record<string, AIPlatform> = {};
      platformData?.forEach(p => {
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
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async (platformId: string) => {
    navigate(`/feedback/${platformId}`);
  };



  const totalEarned = Object.values(submissions)
    .filter(s => s.status === 'approved' || s.status === 'paid')
    .reduce((sum, s) => sum + (s.amount_earned || 0), 0);
  const pendingEarnings = Object.values(submissions)
    .filter(s => s.status === 'submitted')
    .reduce((sum, s) => {
      const platform = platforms[s.platform_id];
      return sum + (platform?.amount_per_submission || 0);
    }, 0);
  const activePlatforms = Object.values(platforms).filter(p => !p.is_assessment);

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-12">
            <div className="grid gap-4 mb-8">
              <div className="w-full bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="w-full bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-4 lg:p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {showWelcome && user && profile && (
        <WelcomeLetter
          userId={user.id}
          signupDate={profile.created_at}
          onClose={() => {
            setShowWelcome(false);
            refreshProfile();
          }}
        />
      )}


      <div className="p-6">
        {profile?.account_status === 'a7F9xQ2mP6kM4rT5' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-800 text-sm">
                  Your account will be automatically deleted after 48 hours if human verification is not completed.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!permissionsLoading && !features.proFeatures && (
          <div className="mb-12">
            <div className="grid gap-4 mb-8">
              <button
                onClick={() => navigate('/verify-payment')}
                className="w-full bg-white rounded-lg p-6 transition text-left hover:shadow-md"
                disabled={features.assessment}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Human Verification</h3>
                    <p className="text-gray-600 text-sm">Verify your identity with a $1 check to confirm you're human and protect the platform from bots</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      !features.assessment 
                        ? 'bg-orange-50 text-orange-700' 
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {!features.assessment ? 'Pending' : 'Completed'}
                    </div>
                    {!features.assessment && (
                      <ChevronRight size={24} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  const assessmentPlatform = Object.values(platforms).find(p => p.is_assessment);
                  const submission = assessmentPlatform && submissions[assessmentPlatform.id];
                  
                  if (submission?.status === 'submitted' || submission?.status === 'approved') {
                    navigate('/awaiting-approval');
                  } else if (submission?.status !== 'rejected' && features.assessment) {
                    navigate('/assessment-test');
                  }
                }}
                className={`w-full bg-white rounded-lg p-6 transition text-left ${
                  !features.assessment || (() => {
                    const ap = Object.values(platforms).find(p => p.is_assessment);
                    return ap && submissions[ap.id]?.status === 'rejected';
                  })() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                }`}
                disabled={!features.assessment || (() => {
                  const ap = Object.values(platforms).find(p => p.is_assessment);
                  return ap && submissions[ap.id]?.status === 'rejected';
                })()}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      !features.assessment ? 'text-gray-500' : 'text-gray-900'
                    }`}>User Testing</h3>
                    <p className={`text-sm ${
                      !features.assessment ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {(() => {
                        const assessmentPlatform = Object.values(platforms).find(p => p.is_assessment);
                        const submission = assessmentPlatform && submissions[assessmentPlatform.id];
                        
                        if (!features.assessment) {
                          return 'Pass test to craft experiences that win hearts and markets (Available after human verification)';
                        } else if (submission?.status === 'rejected') {
                          return 'Assessment failed - No retake allowed';
                        } else if (submission?.status === 'submitted' || submission?.status === 'approved') {
                          return 'Assessment approved - awaiting system update';
                        } else {
                          return 'Pass test to craft experiences that win hearts and markets';
                        }
                      })()
                    }
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-3">
                      {!features.assessment ? (
                        <Lock size={16} className="text-gray-500" />
                      ) : (
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          (() => {
                            const assessmentPlatform = Object.values(platforms).find(p => p.is_assessment);
                            const submission = assessmentPlatform && submissions[assessmentPlatform.id];
                            
                            if (submission?.status === 'rejected') {
                              return 'bg-red-50 text-red-700';
                            } else if (submission?.status === 'submitted' || submission?.status === 'approved') {
                              return 'bg-green-50 text-green-700';
                            } else if (!features.proFeatures) {
                              return 'bg-orange-50 text-orange-700';
                            } else {
                              return 'bg-green-50 text-green-700';
                            }
                          })()
                        }`}>
                          {(() => {
                            const assessmentPlatform = Object.values(platforms).find(p => p.is_assessment);
                            const submission = assessmentPlatform && submissions[assessmentPlatform.id];
                            
                            if (submission?.status === 'rejected') {
                              return 'Failed';
                            } else if (submission?.status === 'submitted') {
                              return 'Under Review';
                            } else if (submission?.status === 'approved') {
                              return 'Approved';
                            } else if (!features.proFeatures) {
                              return 'Pending';
                            } else {
                              return 'Completed';
                            }
                          })()
                        }
                        </div>
                      )}
                      {(() => {
                        const assessmentPlatform = Object.values(platforms).find(p => p.is_assessment);
                        const submission = assessmentPlatform && submissions[assessmentPlatform.id];
                        
                        return (features.assessment && !features.proFeatures && submission?.status !== 'rejected' && !submission) || submission?.status === 'submitted' || submission?.status === 'approved';
                      })() && (
                        <ChevronRight size={24} className="text-gray-400" />
                      )}
                    </div>
                    {platforms && Object.values(platforms).find(p => p.is_assessment) && (
                      <div className="flex flex-col items-end gap-1">
                        {(() => {
                          const ap = Object.values(platforms).find(p => p.is_assessment);
                          if (!ap) return null;
                          return (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-black">payout</span>
                                <span className="rounded-full px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-sm">${ap.amount_per_submission.toFixed(2)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 lg:p-6">
            <p className="text-xs lg:text-sm text-gray-600 font-medium mb-2">Total Earned</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-semibold text-gray-900">${totalEarned.toFixed(2)}</span>
              <span className="text-gray-600 text-xs lg:text-sm">USD</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 lg:p-6">
            <p className="text-xs lg:text-sm text-gray-600 font-medium mb-2">Pending Earnings</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-semibold text-gray-900">${pendingEarnings.toFixed(2)}</span>
              <span className="text-gray-600 text-xs lg:text-sm">potential</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 lg:p-6">
            <p className="text-xs lg:text-sm text-gray-600 font-medium mb-2">Tasks Available</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-semibold text-gray-900">{activePlatforms.length}</span>
              <span className="text-gray-600 text-xs lg:text-sm">platforms</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Tasks Submitted</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900">{Object.values(submissions).filter(s => s.status !== 'in_progress').length}</span>
              <span className="text-gray-600 text-sm">total</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Tasks Approved</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900">{Object.values(submissions).filter(s => s.status === 'approved' || s.status === 'paid').length}</span>
              <span className="text-gray-600 text-sm">total</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Tasks Rejected</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900">{Object.values(submissions).filter(s => s.status === 'rejected').length}</span>
              <span className="text-gray-600 text-sm">total</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Withdrawal Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900">${totalEarned.toFixed(2)}</span>
              <span className="text-gray-600 text-sm">USD</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Under Review</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900">{Object.values(submissions).filter(s => s.status === 'submitted').length}</span>
              <span className="text-gray-600 text-sm">tasks</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">New Tasks</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900">{(() => {
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                nextMonth.setDate(1);
                return nextMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
              })()}</span>
              <span className="text-gray-600 text-sm">date</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
