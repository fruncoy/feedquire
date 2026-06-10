import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Users, Package, ClipboardList, TrendingUp, Mail, X } from 'lucide-react';
import { sendNewTasksEmail } from '../lib/email';
import { Profile } from '../types';

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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [tasks, setTasks] = useState([{ name: '', amount: 0 }]);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin')
        .neq('role', 'system_operator');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

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

  const addTask = () => {
    setTasks([...tasks, { name: '', amount: 0 }]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, field: 'name' | 'amount', value: string | number) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value as any;
    setTasks(newTasks);
  };

  const handleSendEmails = async () => {
    const validTasks = tasks.filter(t => t.name.trim() && t.amount > 0);
    if (validTasks.length === 0) {
      alert('Please add at least one valid task');
      return;
    }

    setSendingEmails(true);
    try {
      // Filter users that have an email
      const usersWithEmail = users.filter(u => u.email);
      
      for (const user of usersWithEmail) {
        if (user.email) {
          await sendNewTasksEmail(user.email, user.full_name || 'User', validTasks);
          // Add small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      alert('Emails sent successfully!');
      setShowEmailModal(false);
      setTasks([{ name: '', amount: 0 }]);
    } catch (err) {
      console.error('Error sending emails:', err);
      alert('Error sending emails');
    } finally {
      setSendingEmails(false);
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Mail size={18} />
            Send New Tasks Email
          </button>
        </div>

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

      {/* Email Modal */}
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
              <h3 className="font-medium text-gray-700">Tasks to Announce</h3>
              
              {tasks.map((task, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Task name"
                      value={task.name}
                      onChange={(e) => updateTask(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={task.amount}
                      onChange={(e) => updateTask(index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {tasks.length > 1 && (
                    <button
                      onClick={() => removeTask(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addTask}
                className="w-full py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                + Add Another Task
              </button>
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
