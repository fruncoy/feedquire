import { useState, useEffect } from 'react';
import { PermissionService } from '../lib/permissions';

interface UserFeatures {
  tasks: boolean;
  revisions: boolean;
  assessment: boolean;
  admin: boolean;
  proFeatures: boolean;
}

export function usePermissions() {
  const [features, setFeatures] = useState<UserFeatures>({
    tasks: false,
    revisions: false,
    assessment: false,
    admin: false,
    proFeatures: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const userFeatures = await PermissionService.getUserFeatures();
      setFeatures(userFeatures);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessTasks = async (): Promise<boolean> => {
    return await PermissionService.canAccessTasks();
  };

  const validateTaskAccess = async (taskId: string): Promise<boolean> => {
    return await PermissionService.validateTaskAccess(taskId);
  };

  return {
    features,
    loading,
    canAccessTasks,
    validateTaskAccess,
    refreshPermissions: loadPermissions
  };
}