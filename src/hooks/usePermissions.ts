import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserFeatures {
  tasks: boolean;
  revisions: boolean;
  assessment: boolean;
  admin: boolean;
  proFeatures: boolean;
}

export function usePermissions() {
  const { profile, loading: authLoading } = useAuth();
  const [features, setFeatures] = useState<UserFeatures>({
    tasks: false,
    revisions: false,
    assessment: false,
    admin: false,
    proFeatures: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (profile) {
      const status = profile.account_status;
      setFeatures({
        tasks: true, // Allow all verified users to access tasks for demo purposes
        revisions: true, 
        assessment: true, 
        admin: profile.role === 'system_operator' || profile.role === 'admin',
        proFeatures: true 
      });
    } else {
      setFeatures({
        tasks: false,
        revisions: false,
        assessment: false,
        admin: false,
        proFeatures: false
      });
    }
    setLoading(false);
  }, [profile, authLoading]);

  const canAccessTasks = async (): Promise<boolean> => {
    return features.tasks;
  };

  const validateTaskAccess = async (taskId: string): Promise<boolean> => {
    return features.tasks;
  };

  return {
    features,
    loading,
    canAccessTasks,
    validateTaskAccess,
    refreshPermissions: () => {}
  };
}