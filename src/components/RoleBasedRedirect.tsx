import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RoleBasedRedirect() {
  const { profile } = useAuth();

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (profile.role === 'system_operator') {
    return <Navigate to="/control" replace />;
  }

  // Default to user dashboard
  return <Navigate to="/dashboard" replace />;
}