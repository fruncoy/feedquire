import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PermissionService } from '../lib/permissions';

interface SecureProtectedRouteProps {
  children: ReactNode;
  requireFeature?: 'tasks' | 'admin' | 'assessment' | 'proFeatures';
}

export function SecureProtectedRoute({ children, requireFeature }: SecureProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, [user, requireFeature]);

  const checkPermissions = async () => {
    if (!user) {
      setHasPermission(false);
      setLoading(false);
      return;
    }

    try {
      if (!requireFeature) {
        setHasPermission(true);
        setLoading(false);
        return;
      }

      let permitted = false;
      switch (requireFeature) {
        case 'tasks':
          permitted = await PermissionService.canAccessTasks();
          break;
        case 'admin':
          permitted = await PermissionService.isAdmin();
          break;
        case 'assessment':
          permitted = await PermissionService.canAccessAssessment();
          break;
        case 'proFeatures':
          const features = await PermissionService.getUserFeatures();
          permitted = features.proFeatures;
          break;
        default:
          permitted = true;
      }

      setHasPermission(permitted);
    } catch (error) {
      console.error('Permission check failed:', error);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
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