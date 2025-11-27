import { supabase } from './supabase';

export class PermissionService {
  private static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    return { user, profile };
  }

  static async canAccessTasks(): Promise<boolean> {
    try {
      const { profile } = await this.getCurrentUser();
      return profile?.account_status === '2hF2kQ7rD5xVfM1tZ';
    } catch {
      return false;
    }
  }

  static async canReviseSubmissions(): Promise<boolean> {
    try {
      const { profile } = await this.getCurrentUser();
      return profile?.account_status === '2hF2kQ7rD5xVfM1tZ';
    } catch {
      return false;
    }
  }

  static async canAccessAssessment(): Promise<boolean> {
    try {
      const { profile } = await this.getCurrentUser();
      return profile?.account_status !== 'a7F9xQ2mP6kM4rT5';
    } catch {
      return false;
    }
  }

  static async isAdmin(): Promise<boolean> {
    try {
      const { profile } = await this.getCurrentUser();
      // Obfuscate admin role check
      return profile?.role === 'system_operator';
    } catch {
      return false;
    }
  }

  static async getUserFeatures(): Promise<{
    tasks: boolean;
    revisions: boolean;
    assessment: boolean;
    admin: boolean;
    proFeatures: boolean;
  }> {
    try {
      const { profile } = await this.getCurrentUser();
      const status = profile?.account_status;
      
      return {
        tasks: status === '2hF2kQ7rD5xVfM1tZ',
        revisions: status === '2hF2kQ7rD5xVfM1tZ',
        assessment: status !== 'a7F9xQ2mP6kM4rT5',
        admin: profile?.role === 'system_operator',
        proFeatures: status === '2hF2kQ7rD5xVfM1tZ'
      };
    } catch {
      return {
        tasks: false,
        revisions: false,
        assessment: false,
        admin: false,
        proFeatures: false
      };
    }
  }

  static async validateTaskAccess(taskId: string): Promise<boolean> {
    try {
      const canAccess = await this.canAccessTasks();
      if (!canAccess) return false;

      // Additional validation logic here
      return true;
    } catch {
      return false;
    }
  }
}