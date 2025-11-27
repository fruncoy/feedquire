import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { LogOut, Home, CheckSquare, FileText, User, CreditCard, Users, Package, ClipboardList, Crown } from 'lucide-react';
import { Logo } from './Logo';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const { features } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Determine admin status from current route to avoid exposing role
  const isAdminRoute = location.pathname.startsWith('/control');
  
  const menuItems = isAdminRoute ? [
    { path: '/control', icon: Home, label: 'Control' },
    { path: '/control/accounts', icon: Users, label: 'Accounts' },
    { path: '/control/systems', icon: Package, label: 'Systems' },
    { path: '/control/reports', icon: ClipboardList, label: 'Reports' },
  ] : [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/submissions', icon: FileText, label: 'Submissions' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 fixed top-0 left-0 h-full z-50 transition-all duration-300`}>
        <div className="p-6 h-20 flex items-center justify-between">
          {!sidebarCollapsed && <Logo className="h-8 w-auto" />}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-[#000150] rounded-sm"></div>
              <div className="w-2 h-2 bg-[#000150] rounded-sm"></div>
              <div className="w-2 h-2 bg-[#000150] rounded-sm"></div>
              <div className="w-2 h-2 bg-[#000150] rounded-sm"></div>
            </div>
          </button>
        </div>
        
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2 rounded-lg text-left ${
                  isActive 
                    ? 'text-gray-900 bg-gray-100 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon size={20} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-20 left-4 right-4">
          {!isAdminRoute && (
            <div className="mb-4">
              <button 
                onClick={() => navigate('/account')}
                className="w-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 hover:from-amber-100 hover:to-yellow-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Crown size={16} className="text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Go Pro</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 border-t border-gray-200 pt-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg`}
            title={sidebarCollapsed ? 'Sign out' : ''}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 min-h-screen`}>
        {/* Header */}
        <div className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="px-6 py-6 h-20 flex items-center justify-end gap-3">
            <p className="text-gray-600 text-sm">Honored to have you, <span className="font-medium text-gray-900">{profile?.full_name?.split(' ')[0] || 'User'}</span></p>
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {(profile?.full_name?.charAt(0) || 'U').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        {children}
        {/* Loading Bar */}
        {loading && (
          <div className={`fixed top-0 ${sidebarCollapsed ? 'left-16' : 'left-64'} right-0 h-0.5 bg-gray-100 transition-all duration-300 z-40`}>
            <div className="h-full bg-[#000150] animate-pulse" style={{width: '100%', animation: 'loadLeft 0.3s ease-out'}}></div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes loadLeft {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}