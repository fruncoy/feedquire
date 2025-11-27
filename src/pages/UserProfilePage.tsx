import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { ChevronLeft, CheckCircle2, XCircle, Ban, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

export function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({
    totalSubmissions: 0,
    approvedCount: 0,
    rejectedCount: 0,
    pendingCount: 0,
    totalEarned: 0,
    paidAmount: 0,
    availableAmount: 0,
  });

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (userError) throw userError;
      setUser(userData);

      // Fetch user submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('feedback_submissions')
        .select(`
          *,
          ai_platforms (domain)
        `)
        .eq('user_id', userId)
        .neq('status', 'in_progress')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;
      setSubmissions(submissionsData || []);

      // Calculate stats
      const totalSubmissions = submissionsData?.length || 0;
      const approvedCount = submissionsData?.filter(s => s.status === 'approved' || s.status === 'paid').length || 0;
      const rejectedCount = submissionsData?.filter(s => s.status === 'rejected').length || 0;
      const pendingCount = submissionsData?.filter(s => s.status === 'submitted').length || 0;
      const totalEarned = submissionsData?.reduce((sum, s) => sum + (s.amount_earned || 0), 0) || 0;
      const paidAmount = submissionsData?.filter(s => s.status === 'paid').reduce((sum, s) => sum + (s.amount_earned || 0), 0) || 0;
      const availableAmount = totalEarned - paidAmount;

      setUserStats({
        totalSubmissions,
        approvedCount,
        rejectedCount,
        pendingCount,
        totalEarned,
        paidAmount,
        availableAmount,
      });
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      tier1: { bg: 'bg-blue-50', text: 'text-blue-700', icon: <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> },
      tier2: { bg: 'bg-orange-50', text: 'text-orange-700', icon: <AlertCircle size={16} /> },
      tier3: { bg: 'bg-green-50', text: 'text-green-700', icon: <CheckCircle2 size={16} /> },
      rejected: { bg: 'bg-red-50', text: 'text-red-700', icon: <XCircle size={16} /> },
      banned: { bg: 'bg-gray-50', text: 'text-gray-700', icon: <Ban size={16} /> },
    };
    return badges[status] || badges.tier1;
  };

  const getSubmissionStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      submitted: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
      approved: { bg: 'bg-green-50', text: 'text-green-700' },
      rejected: { bg: 'bg-red-50', text: 'text-red-700' },
      paid: { bg: 'bg-blue-50', text: 'text-blue-700' },
    };
    return badges[status] || badges.submitted;
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
            <p className="text-gray-600">Loading user profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-6 h-20 flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-gray-900">User Not Found</h1>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600">The requested user profile could not be found.</p>
          <button
            onClick={() => navigate('/admin/users')}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Back to Users
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const badge = getStatusBadge(user.account_status);

  return (
    <DashboardLayout>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-6 h-20 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">User Profile</h1>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ChevronLeft size={18} />
            Back to Users
          </button>

          {/* User Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Overview</h2>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user.full_name || 'User'}</h3>
                  <p className="text-gray-600">{user.user_id}</p>
                </div>
                <div className={`${badge.bg} ${badge.text} px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium`}>
                  {badge.icon}
                  {user.account_status}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Join Date</p>
                  <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Account Verification</p>
                  <p className="text-gray-900">{user.account_status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Submission Summary</h2>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Total</p>
                  <p className="text-2xl font-semibold text-gray-900">{userStats.totalSubmissions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Approved</p>
                  <p className="text-2xl font-semibold text-green-600">{userStats.approvedCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Pending</p>
                  <p className="text-2xl font-semibold text-orange-600">{userStats.pendingCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Rejected</p>
                  <p className="text-2xl font-semibold text-red-600">{userStats.rejectedCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Paid</p>
                  <p className="text-2xl font-semibold text-green-600">${userStats.paidAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Available</p>
                  <p className="text-2xl font-semibold text-blue-600">${userStats.availableAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Total Earned</p>
                  <p className="text-2xl font-semibold text-gray-900">${userStats.totalEarned.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Submissions</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Earned</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => {
                      const statusBadge = getSubmissionStatusBadge(submission.status);
                      return (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {submission.ai_platforms?.domain || 'Unknown Platform'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`${statusBadge.bg} ${statusBadge.text} px-3 py-1 rounded-full text-sm font-medium`}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${submission.amount_earned?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : 'Not submitted'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.completion_percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {submissions.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No submissions found for this user.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}