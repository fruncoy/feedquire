import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { LogOut, Home, CheckSquare, FileText, User, CreditCard, Users, Package, ClipboardList, Crown, Trash2, MessageSquare, Ticket } from 'lucide-react';
import { Logo } from './Logo';
import { HelpButton } from './HelpButton';

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
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };



  // Determine admin status from current route to avoid exposing role
  const isAdminRoute = location.pathname.startsWith('/control');
  
  const menuItems = isAdminRoute ? [
    { path: '/control', icon: Home, label: 'Control' },
    { path: '/control/accounts', icon: Users, label: 'Accounts' },
    { path: '/control/systems', icon: Package, label: 'Systems' },
    { path: '/control/reports', icon: ClipboardList, label: 'Reports' },
    { path: '/control/tickets', icon: MessageSquare, label: 'Tickets' },
    { path: '/control/cleanup', icon: Trash2, label: 'Cleanup' },
  ] : [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/submissions', icon: FileText, label: 'Submissions' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/submit-ticket', icon: Ticket, label: 'Submit Ticket' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileExpanded(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        // Mobile: collapsed (60px) or expanded (75% width)
        mobileExpanded ? 'w-3/4' : 'w-15'
      } ${
        // Desktop: normal behavior
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      } bg-white border-r border-gray-200 fixed top-0 left-0 h-screen z-50 transition-all duration-300`}>
        
        <div className="p-3 lg:p-6 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo */}
          {(mobileExpanded || !sidebarCollapsed) && <Logo className={`${mobileExpanded ? 'block' : 'hidden'} lg:block h-8 w-auto`} />}
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
              <div className="w-2.5 h-2.5 bg-[#000150] rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-[#000150] rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-[#000150] rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-[#000150] rounded-sm"></div>
            </div>
          </button>
          
          {/* Desktop Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block p-1 hover:bg-gray-100 rounded"
          >
            <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-[#000150] rounded-sm"></div>
              <div className="w-2 h-2 bg-[#000150] rounded-sm"></div>
              <div className="w-2 h-2 bg-[#000150] rounded-sm"></div>
              <div className="w-2 h-2 bg-[#000150] rounded-sm"></div>
            </div>
          </button>
        </div>
        
        <nav className="px-2 lg:px-4 space-y-1 lg:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const showText = mobileExpanded;
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileExpanded(false); // Close mobile menu after navigation
                }}
                className={`w-full flex items-center ${showText ? 'gap-3 px-3' : 'justify-center px-1'} ${sidebarCollapsed ? 'lg:justify-center lg:px-1' : 'lg:justify-start lg:gap-3 lg:px-6'} py-2 lg:py-2 rounded-lg text-left ${
                  isActive 
                    ? 'text-[#000150] font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                title={!showText ? item.label : ''}
              >
                <Icon size={20} className="lg:w-5 lg:h-5" />
                {showText && <span>{item.label}</span>}
                {!sidebarCollapsed && <span className="hidden lg:block">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        
        <div className={`absolute ${mobileExpanded ? 'bottom-32' : 'bottom-20'} ${sidebarCollapsed ? 'lg:bottom-20' : 'lg:bottom-32'} left-2 right-2 lg:left-4 lg:right-4`}>
          {!isAdminRoute && (
            <div className="mb-4">
              <button 
                onClick={() => {
                  navigate('/account');
                  setMobileExpanded(false);
                }}
                className={`w-full flex items-center ${mobileExpanded ? 'gap-3 px-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' : 'justify-center px-2'} ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'lg:justify-start lg:gap-3 lg:px-6 lg:bg-gradient-to-r lg:from-amber-50 lg:to-yellow-50 lg:border lg:border-amber-200'} py-2 rounded-lg hover:bg-amber-100 transition-all duration-200`}
                title={!(mobileExpanded || !sidebarCollapsed) ? 'Go Pro' : ''}
              >
                <Crown size={20} className="lg:w-5 lg:h-5 text-amber-600" />
                {mobileExpanded && <span className="text-sm font-medium text-amber-800">Go Pro</span>}
                {!sidebarCollapsed && <span className="hidden lg:block text-sm font-medium text-amber-800">Go Pro</span>}
              </button>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-4 left-2 right-2 lg:left-4 lg:right-4 border-t border-gray-200 pt-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${mobileExpanded ? 'gap-3 px-3' : 'justify-center px-1'} ${sidebarCollapsed ? 'lg:justify-center lg:px-1' : 'lg:justify-start lg:gap-3 lg:px-6'} py-2 lg:py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg mb-3`}
            title={!(mobileExpanded || !sidebarCollapsed) ? 'Sign out' : ''}
          >
            <LogOut size={20} className="lg:w-5 lg:h-5" />
            {mobileExpanded && <span>Sign out</span>}
            {!sidebarCollapsed && <span className="hidden lg:block">Sign out</span>}
          </button>
          {mobileExpanded && (
            <p className="text-xs text-gray-500 text-left leading-relaxed px-3">
              Copyright © 2025 Feedquire® <br /> San Francisco, CA.
            </p>
          )}
          {!sidebarCollapsed && (
            <p className="hidden lg:block text-xs text-gray-500 text-left leading-relaxed px-3">
              Copyright © 2025 Feedquire® <br /> San Francisco, CA.
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`ml-15 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300 min-h-screen`}>
        {/* Header */}
        <div className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="px-4 lg:px-6 py-4 lg:py-6 h-16 lg:h-20 flex items-center justify-end gap-3">
            <div className="flex items-center gap-3">
              <p className="text-gray-600 text-sm">Honored to have you, <span className="font-medium text-gray-900">{profile?.full_name?.split(' ')[0] || 'User'}</span></p>
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(profile?.full_name?.charAt(0) || 'U').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
        {children}

      </div>
      
      {!isAdminRoute && <HelpButton />}
      
      <style>{`
        @keyframes loadLeft {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}