import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Clock, CheckCircle2, FileText } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';

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
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">


          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Account Under Review</h2>
            <p className="text-gray-600">Your assessment is being reviewed by our team</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Our team will review your assessment within 3-5 business days</li>
              <li>• If approved, you will gain access to regular tasks and earning opportunities</li>
              <li>• If additional information is needed, we will contact you directly</li>
            </ul>
          </div>


        </div>
      </div>
    </DashboardLayout>
  );
}
