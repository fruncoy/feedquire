import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { NotFoundPage } from '../pages/NotFoundPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredStatus?: string;
  minTier?: 'tier1' | 'tier2' | 'tier3';
}

export function ProtectedRoute({ children, requiredRole, requiredStatus, minTier }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  
  const userPages = ['/dashboard', '/tasks', '/submissions', '/profile', '/payments'];
  const adminPages = ['/control', '/control/accounts', '/control/systems', '/control/reports'];
  const isUserPage = userPages.includes(window.location.pathname);
  const isAdminPage = adminPages.some(page => window.location.pathname.startsWith(page));
  const requiresStrictProfile = Boolean(requiredRole || requiredStatus || minTier);
  
  // While loading, allow non-strict pages to render; keep spinner for strict routes
  if (loading) {
    if (!requiresStrictProfile) {
      return <>{children}</>;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but profile is not yet loaded, allow rendering unless strict checks are required
  if (user && !profile && !requiresStrictProfile) {
    return <>{children}</>;
  }
  // If strict checks are required, wait for profile
  if (user && !profile && requiresStrictProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  // Check role-based access - only show 404 if user has wrong role
  if (requiredRole && profile && profile.role !== requiredRole) {
    return <NotFoundPage />;
  }

  // Auto-redirect admins to admin dashboard when accessing user pages
  if (profile?.role === 'system_operator' && isUserPage) {
    return <Navigate to="/control" replace />;
  }

  // Auto-redirect users to user dashboard when accessing admin pages
  if (profile?.role === 'user' && isAdminPage) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check account status requirements
  if (requiredStatus && profile?.account_status !== requiredStatus && requiredStatus !== 'any') {
    if (profile?.account_status === 'rejected' || profile?.account_status === 'banned') {
      return <Navigate to="/account-denied" replace />;
    }
  }

  return <>{children}</>;
}
