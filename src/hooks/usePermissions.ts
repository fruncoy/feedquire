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
    if (authLoading) {
      return;
    }
    
    setFeatures({
      tasks: true, 
      revisions: true, 
      assessment: true, 
      admin: true, // DEMO: Allow all users to be admins
      proFeatures: true 
    });
    setLoading(false);
  }, [authLoading]);

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