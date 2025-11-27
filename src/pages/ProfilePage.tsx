import { DashboardLayout } from '../components/DashboardLayout';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { User, Mail, TrendingUp, Shield, ChevronDown, ChevronUp } from 'lucide-react';

export function ProfilePage() {
  const { profile, user } = useAuth();
  const { features } = usePermissions();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!profile || !user) {
    return (
      <DashboardLayout>

        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getUserLevel = () => {
    if (features.admin) return { label: 'Admin', color: 'bg-purple-100 text-purple-800' };
    if (features.proFeatures) return { label: 'Pro User', color: 'bg-green-100 text-green-800' };
    if (features.assessment) return { label: 'Verified', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Basic', color: 'bg-gray-100 text-gray-800' };
  };

  const userLevel = getUserLevel();

  return (
    <DashboardLayout>


      <div className="p-6">
        {/* ID Card Style Profile */}
        <div className="bg-gradient-to-r from-[#000150] to-[#000180] rounded-xl p-8 text-white mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-[#000150]">
                  {profile.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{profile.full_name}</h2>
                <p className="text-white/80 mb-2">{user.email}</p>
                <div className="flex items-center gap-3">
                  <span className="text-white/60 text-sm">
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm mb-1">Total Earned</p>
              <p className="text-2xl font-bold">${profile.total_earned.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Settings Accordion */}
        <div className="bg-white rounded-lg border border-gray-200">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <Shield className="text-gray-600" size={20} />
              <span className="font-semibold text-gray-900">Account Settings</span>
            </div>
            {settingsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {settingsOpen && (
            <div className="border-t border-gray-200 p-6">
              <div className="grid gap-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <User className="text-gray-600" size={20} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Full Name</p>
                    <p className="text-gray-600 text-sm">{profile.full_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-600" size={20} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Email Address</p>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="text-gray-600" size={20} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Success Rate</p>
                    <p className="text-gray-600 text-sm">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}