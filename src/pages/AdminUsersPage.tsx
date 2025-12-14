import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { ChevronLeft, CheckCircle2, XCircle, Ban, AlertCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [updating, setUpdating] = useState(false);
  const [userStats, setUserStats] = useState<Record<string, { totalSubmissions: number; approvedCount: number; rejectedCount: number; totalEarned: number }>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch users and their submission stats in parallel
      const [usersResult, submissionsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .neq('role', 'admin')
          .order('created_at', { ascending: false }),
        supabase
          .from('feedback_submissions')
          .select('user_id, status, amount_earned')
      ]);

      if (usersResult.error) throw usersResult.error;
      setUsers(usersResult.data || []);
      
      // Process submission stats
      if (usersResult.data && submissionsResult.data) {
        const stats: Record<string, any> = {};
        
        // Initialize stats for all users
        usersResult.data.forEach(user => {
          stats[user.user_id] = {
            totalSubmissions: 0,
            approvedCount: 0,
            rejectedCount: 0,
            totalEarned: 0
          };
        });
        
        // Aggregate submission data
        submissionsResult.data.forEach(submission => {
          if (stats[submission.user_id]) {
            stats[submission.user_id].totalSubmissions++;
            if (submission.status === 'approved' || submission.status === 'paid') {
              stats[submission.user_id].approvedCount++;
            }
            if (submission.status === 'rejected') {
              stats[submission.user_id].rejectedCount++;
            }
            stats[submission.user_id].totalEarned += submission.amount_earned || 0;
          }
        });
        
        setUserStats(stats);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setUpdating(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          account_status: '2hF2kQ7rD5xVfM1tZ',
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      const { error: assessmentError } = await supabase
        .from('logs')
        .update({ status: 'approved' })
        .eq('user_id', userId);

      if (assessmentError) throw assessmentError;

      await fetchUsers();
      if (selectedUser) {
        const { data: updatedUser } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', selectedUser.user_id)
          .single();
        if (updatedUser) {
          setSelectedUser(updatedUser);
        }
      }
    } catch (err) {
      console.error('Error approving user:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (userId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          account_status: 'rejected',
        })
        .eq('user_id', userId);

      if (error) throw error;

      await fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      console.error('Error rejecting user:', err);
    } finally {
      setUpdating(false);
    }
  };



  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user account? This action cannot be undone.')) return;
    
    setUpdating(true);
    try {
      // Delete user submissions first
      await supabase
        .from('feedback_submissions')
        .delete()
        .eq('user_id', userId);

      // Delete user profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      await fetchUsers();
      if (selectedUser && selectedUser.user_id === userId) {
        setSelectedUser(null);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      'a7F9xQ2mP6kM4rT5': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Tier 1' },
      '1Q3bF8vL1nT9pB6wR': { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Tier 2' },
      '2hF2kQ7rD5xVfM1tZ': { bg: 'bg-green-50', text: 'text-green-700', label: 'Tier 3' },
      'rejected': { bg: 'bg-red-50', text: 'text-red-700', label: 'Rejected' },
      'banned': { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Banned' },
    };
    const badge = badges[status] || { bg: 'bg-gray-50', text: 'text-gray-700', label: status };
    return badge;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, sectionIdx) => (
              <div key={sectionIdx}>
                <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <tr key={idx} className="animate-pulse">
                            <td className="px-6 py-4">
                              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </td>
                            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                            <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-8"></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (selectedUser) {
    const badge = getStatusBadge(selectedUser.account_status);
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setSelectedUser(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ChevronLeft size={18} />
            Back to Users
          </button>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedUser.full_name || 'User'}</h2>
                <p className="text-gray-600">{selectedUser.user_id}</p>
              </div>
              <div className={`${badge.bg} ${badge.text} px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium`}>
                {badge.label}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-t border-b border-gray-300">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Verification Status</p>
                <p className="text-gray-900">{selectedUser.verification_status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Payment Status</p>
                <p className="text-gray-900">{selectedUser.payment_status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Test Score</p>
                <p className="text-gray-900">{selectedUser.test_score}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Earned</p>
                <p className="text-gray-900">${selectedUser.total_earned.toFixed(2)}</p>
              </div>
            </div>

            {(selectedUser.verification_status === 'awaiting_approval' || selectedUser.account_status === '1Q3bF8vL1nT9pB6wR') && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(selectedUser.user_id)}
                  disabled={updating}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {updating ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(selectedUser.user_id)}
                  disabled={updating}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {updating ? 'Processing...' : 'Reject'}
                </button>
              </div>
            )}


          </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const tier3Users = users.filter(u => u.account_status === '2hF2kQ7rD5xVfM1tZ' && u.role !== 'system_operator').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const tier2Users = users.filter(u => u.account_status === '1Q3bF8vL1nT9pB6wR' && u.role !== 'system_operator').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const tier1Users = users.filter(u => u.account_status === 'a7F9xQ2mP6kM4rT5' && u.role !== 'system_operator').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const renderUserTable = (users: any[], title: string) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title} ({users.length})</h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const badge = getStatusBadge(user.account_status);
                const stats = userStats[user.user_id] || { totalSubmissions: 0, approvedCount: 0, rejectedCount: 0, totalEarned: 0 };
                return (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.full_name || 'User'}
                      <br />
                      <span className="text-xs text-gray-500">
                        {stats.totalSubmissions} submissions
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('en-GB', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        timeZone: 'Africa/Nairobi'
                      }).replace(/,/g, ',').replace(/(\d+)/, '$1th')}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(user.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'Africa/Nairobi'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => navigate(`/control/accounts/${user.user_id}`)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        title="View Profile"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {renderUserTable(tier3Users, 'Tier 3 Users')}
        {renderUserTable(tier2Users, 'Tier 2 Users')}
        {renderUserTable(tier1Users, 'Tier 1 Users')}
      </div>
    </DashboardLayout>
  );
}
