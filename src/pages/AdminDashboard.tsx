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
    totalPlatforms: 0,
    unqualifiedUsers: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
    totalPaidOut: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Users by tier
      const { count: tier1Count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('account_status', 'tier1');

      const { count: tier2Count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('account_status', 'tier2');

      const { count: tier3Count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('account_status', 'tier3');

      // Unqualified users (rejected)
      const { count: unqualifiedCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('account_status', 'rejected');

      // Total platforms
      const { count: platformsCount } = await supabase
        .from('ai_platforms')
        .select('*', { count: 'exact', head: true });

      // Submissions by status
      const { count: pendingCount } = await supabase
        .from('feedback_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'submitted')
        .neq('status', 'in_progress');

      const { count: approvedCount } = await supabase
        .from('feedback_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .neq('status', 'in_progress');

      const { count: rejectedCount } = await supabase
        .from('feedback_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected')
        .neq('status', 'in_progress');

      // Payment calculations
      const { data: paidSubmissions } = await supabase
        .from('feedback_submissions')
        .select('amount_earned')
        .eq('status', 'paid')
        .neq('status', 'in_progress');

      const { data: pendingPaymentSubmissions } = await supabase
        .from('feedback_submissions')
        .select('amount_earned')
        .eq('status', 'approved')
        .neq('status', 'in_progress');

      const totalPaidOut = paidSubmissions?.reduce((sum, s) => sum + (s.amount_earned || 0), 0) || 0;
      const pendingPayments = pendingPaymentSubmissions?.reduce((sum, s) => sum + (s.amount_earned || 0), 0) || 0;

      // Total received from tier2 verification (assuming $1 per tier2 user)
      const totalReceived = (tier2Count || 0) + (tier3Count || 0);

      setStats({
        totalUsers: usersCount || 0,
        tier1Users: tier1Count || 0,
        tier2Users: tier2Count || 0,
        tier3Users: tier3Count || 0,
        totalReceived,
        totalPlatforms: platformsCount || 0,
        unqualifiedUsers: unqualifiedCount || 0,
        pendingSubmissions: pendingCount || 0,
        approvedSubmissions: approvedCount || 0,
        rejectedSubmissions: rejectedCount || 0,
        totalPaidOut,
        pendingPayments,
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
      value: `$${stats.totalReceived.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      label: 'AI Platforms',
      value: stats.totalPlatforms,
      icon: Package,
      color: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      label: 'Unqualified Users (Who Admin marked Lost, From tier3)',
      value: stats.unqualifiedUsers,
      icon: Users,
      color: 'bg-red-50',
      textColor: 'text-red-700',
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
    {
      label: 'Total Paid Out',
      value: `$${stats.totalPaidOut.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Pending Payments',
      value: `$${stats.pendingPayments.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <DashboardLayout>
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-6 h-20 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {statCards.map((stat, idx) => {
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
                  {loading ? '-' : stat.value}
                </p>
              </div>
            );
          })}
        </div>


      </div>
    </DashboardLayout>
  );
}
