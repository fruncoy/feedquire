import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AwaitingApprovalPage() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('account_status')
        .eq('user_id', profile?.user_id)
        .maybeSingle();

      if (error) throw error;

      if (data?.account_status === 'tier3') {
        window.location.reload();
      }
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
            <Clock size={32} className="text-blue-600" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Account Under Review</h1>

        <p className="text-gray-600 mb-2">
          Thank you for completing your assessment test!
        </p>

        <p className="text-gray-600 mb-8">
          Our team is reviewing your submission. This usually takes 24-48 hours. We'll notify you by email when your account is approved.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-blue-900">
            <strong>What happens next?</strong>
          </p>
          <ul className="text-sm text-blue-800 mt-3 space-y-2 text-left">
            <li>• We review your assessment for quality</li>
            <li>• We confirm your human verification</li>
            <li>• Your account is approved and activated</li>
            <li>• You gain access to available AI platform surveys</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {refreshing ? 'Checking status...' : 'Check Status'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-6 py-2.5 text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-8">
          Email: {profile?.user_id}
        </p>
      </div>
    </div>
  );
}
