import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, AlertCircle } from 'lucide-react';

export function AccountDeniedPage() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle size={32} className="text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Account Access Denied</h1>

        <p className="text-gray-600 mb-8">
          {profile?.account_status === 'banned'
            ? 'Your account has been banned. Please contact support for more information.'
            : 'Your application has been rejected. Please review our guidelines and try again.'}
        </p>

        <button
          onClick={handleLogout}
          className="w-full px-6 py-2.5 text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
