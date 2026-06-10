import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SecureProtectedRouteProps {
  children: ReactNode;
  requireFeature?: 'tasks' | 'admin' | 'assessment' | 'proFeatures';
}

export function SecureProtectedRoute({ children, requireFeature }: SecureProtectedRouteProps) {
  const { user, profile, company, loading: authLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('SecureProtectedRoute state:', { user, profile, company, authLoading, hasPermission, loading, requireFeature });

  useEffect(() => {
    checkPermissions();
  }, [user, profile, company, authLoading, requireFeature]);

  const checkPermissions = async () => {
    console.log('checkPermissions called with:', { user, profile, company, authLoading, requireFeature });
    if (authLoading) {
      return; // Don't check permissions while auth is still loading
    }
    
    if (!user) {
      setHasPermission(false);
      setLoading(false);
      return;
    }

    if (!requireFeature) {
      setHasPermission(true);
      setLoading(false);
      return;
    }

    let permitted = false;
    switch (requireFeature) {
      case 'tasks':
        permitted = profile?.account_status === '2hF2kQ7rD5xVfM1tZ';
        break;
      case 'admin':
        permitted = profile?.role === 'system_operator';
        break;
      case 'assessment':
        permitted = profile?.account_status !== 'a7F9xQ2mP6kM4rT5';
        break;
      case 'proFeatures':
        permitted = profile?.account_status === '2hF2kQ7rD5xVfM1tZ';
        break;
      default:
        permitted = true;
    }

    console.log('checkPermissions result:', { permitted, requireFeature, profile });
    setHasPermission(permitted);
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (hasPermission === false) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}