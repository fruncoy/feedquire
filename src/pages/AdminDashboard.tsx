import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Users, Package, ClipboardList, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    tier1Users: 0,
    tier2Users: 0,
    tier3Users: 0,
    totalReceived: 0,


    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,

  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all data in parallel for better performance
      const [
        usersResult,
        tier1Result,
        tier2Result,
        tier3Result,


        pendingResult,
        approvedResult,
        rejectedSubResult
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'system_operator'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('account_status', 'a7F9xQ2mP6kM4rT5').neq('role', 'system_operator'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('account_status', '1Q3bF8vL1nT9pB6wR').neq('role', 'system_operator'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('account_status', '2hF2kQ7rD5xVfM1tZ').neq('role', 'system_operator'),


        supabase.from('feedback_submissions').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
        supabase.from('feedback_submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
supabase.from('feedback_submissions').select('*', { count: 'exact', head: true }).eq('status', 'rejected')
      ]);

      const totalReceived = ((tier2Result.count || 0) + (tier3Result.count || 0)) * 130;

      setStats({
        totalUsers: usersResult.count || 0,
        tier1Users: tier1Result.count || 0,
        tier2Users: tier2Result.count || 0,
        tier3Users: tier3Result.count || 0,
        totalReceived,


        pendingSubmissions: pendingResult.count || 0,
        approvedSubmissions: approvedResult.count || 0,
        rejectedSubmissions: rejectedSubResult.count || 0,

      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/authy');
  };

  const statCards = [
    {
      label: 'Total Users (ALL)',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Total Users (In Tier1)',
      value: stats.tier1Users,
      icon: Users,
      color: 'bg-gray-50',
      textColor: 'text-gray-700',
    },
    {
      label: 'Total Users (In Tier2)',
      value: stats.tier2Users,
      icon: Users,
      color: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      label: 'Total Users (In Tier3)',
      value: stats.tier3Users,
      icon: Users,
      color: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Total Received (from tier2 user verification)',
      value: `${stats.totalReceived} KSh`,
      icon: TrendingUp,
      color: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },


    {
      label: 'Pending Submissions',
      value: stats.pendingSubmissions,
      icon: ClipboardList,
      color: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      label: 'Approved Submissions',
      value: stats.approvedSubmissions,
      icon: ClipboardList,
      color: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Rejected Submissions',
      value: stats.rejectedSubmissions,
      icon: ClipboardList,
      color: 'bg-red-50',
      textColor: 'text-red-700',
    },

  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {loading ? (
            // Skeleton loading
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))
          ) : (
            statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className={`${stat.color} rounded-lg border border-gray-200 p-6`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${stat.textColor} p-2 rounded-lg bg-white`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className={`text-3xl font-semibold ${stat.textColor} mt-2`}>
                    {stat.value}
                  </p>
                </div>
              );
            })
          )}
        </div>


      </div>
    </DashboardLayout>
  );
}
