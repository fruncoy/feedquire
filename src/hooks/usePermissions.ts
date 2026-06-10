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
  const { profile, company, loading: authLoading } = useAuth();
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
    
    if (profile) {
      // Logic for user profiles
      const status = profile.account_status;
      setFeatures({
        tasks: status === '1Q3bF8vL1nT9pB6wR' || status === '2hF2kQ7rD5xVfM1tZ',
        revisions: status === '2hF2kQ7rD5xVfM1tZ',
        assessment: status !== 'a7F9xQ2mP6kM4rT5',
        admin: profile.role === 'system_operator' || profile.role === 'admin',
        proFeatures: status === '2hF2kQ7rD5xVfM1tZ'
      });
    } else if (company) {
      // Logic for company profiles
      setFeatures({
        tasks: false,
        revisions: false,
        assessment: false,
        admin: false,
        proFeatures: false
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
  }, [profile, company, authLoading]);

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