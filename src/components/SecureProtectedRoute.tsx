import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

interface SecureProtectedRouteProps {
  children: ReactNode;
  requireFeature?: 'tasks' | 'admin' | 'assessment' | 'proFeatures';
}

export function SecureProtectedRoute({ children, requireFeature }: SecureProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { features, loading: permissionsLoading } = usePermissions();

  console.log('SecureProtectedRoute state:', { user, authLoading, features, permissionsLoading, requireFeature });

  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireFeature && !features[requireFeature]) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}