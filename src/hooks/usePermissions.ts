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
  const { profile, company, loading: authLoading, user } = useAuth();
  const [features, setFeatures] = useState<UserFeatures>({
    tasks: true,
    revisions: true,
    assessment: true,
    admin: true,
    proFeatures: true
  });
  const [loading, setLoading] = useState(false); // No loading for now for demo

  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (profile) {
      // Logic for user profiles
      const status = profile.account_status;
      setFeatures({
        tasks: true, // Allow all for demo
        revisions: true,
        assessment: true,
        admin: true,
        proFeatures: true
      });
    } else if (company) {
      // Logic for company profiles
      setFeatures({
        tasks: true,
        revisions: true,
        assessment: true,
        admin: true,
        proFeatures: true
      });
    } else {
      // If no profile/company yet, allow all for demo
      setFeatures({
        tasks: true,
        revisions: true,
        assessment: true,
        admin: true,
        proFeatures: true
      });
    }
    setLoading(false);
  }, [profile, company, authLoading, user]);

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