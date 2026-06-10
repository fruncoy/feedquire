
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile, User, Company } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  session: Session | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshCompany: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  console.log('AuthContext - Current state:', { user, profile, company, loading });

  async function fetchProfile(userId: string) {
    console.log('AuthContext - fetchProfile for userId:', userId);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('AuthContext - fetchProfile result:', { data, error });

      if (error || !data) {
        console.log('AuthContext - no profile found or error (DEMO: NOT signing out)');
        setLoading(false);
        // For demo purposes, don't sign out
        return;
      }

      console.log('AuthContext - profile found:', data);
      setProfile(data as Profile);
    } catch (error) {
      console.error('AuthContext - fetchProfile error (catch block) (DEMO: NOT signing out):', error);
      setLoading(false);
    }
  }

  async function fetchCompany(userId: string) {
    console.log('AuthContext - fetchCompany for userId:', userId);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('AuthContext - fetchCompany result:', { data, error });

      if (!error) {
        setCompany(data as Company | null);
      } else {
        console.error('AuthContext - fetchCompany error:', error);
        setCompany(null);
      }
    } catch (error) {
      console.error('AuthContext - fetchCompany error (catch block):', error);
      setCompany(null);
    }
  }

  useEffect(() => {
    console.log('AuthContext - initializing');
    
    // Safety timeout: force loading to false after 15 seconds to avoid infinite load
    const safetyTimeout = setTimeout(() => {
      console.log('AuthContext - safety timeout triggered');
      setLoading(false);
    }, 15000);

    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('AuthContext - initial session:', data.session);
        setSession(data.session);

        if (data.session) {
          const user = data.session.user;
          setUser({
            id: user.id,
            email: user.email || '',
            user_metadata: user.user_metadata,
          });
        }
      } catch (error) {
        console.error('AuthContext - initializeAuth error:', error);
      } finally {
        console.log('AuthContext - initializeAuth: setting loading to false');
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('AuthContext - auth state changed:', event, 'newSession:', newSession?.user?.email);
      setSession(newSession);

      if (newSession) {
        const user = newSession.user;
        setUser({
          id: user.id,
          email: user.email || '',
          user_metadata: user.user_metadata,
        });
      } else {
        console.log('AuthContext - authStateChange: no session, clearing state');
        setUser(null);
        setProfile(null);
        setCompany(null);
      }

      console.log('AuthContext - authStateChange: setting loading to false');
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (name: string, email: string, password: string, phone?: string) => {
    try {
      console.log('AuthContext - signUp for email:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone_number: phone || ''
          }
        }
      });

      if (error) throw error;

      if (data.user && phone) {
        await supabase
          .from('profiles')
          .update({ mpesa_number: phone })
          .eq('user_id', data.user.id);
      }

      console.log('AuthContext - signUp successful:', data.user?.email);
    } catch (error) {
      console.error('AuthContext - signUp error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext - signIn for email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log('AuthContext - signIn successful:', data.user?.email);
    } catch (error) {
      console.error('AuthContext - signIn error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (isSigningOut) {
      console.log('AuthContext - already signing out, skipping');
      return;
    }

    try {
      console.log('AuthContext - signing out user');
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setCompany(null);
      setSession(null);
      setLoading(false);

      console.log('AuthContext - signOut successful');
    } catch (error) {
      console.error('AuthContext - signOut error:', error);
      throw error;
    } finally {
      setIsSigningOut(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const refreshCompany = async () => {
    if (user) {
      await fetchCompany(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, company, session, loading, signUp, signIn, signOut, refreshProfile, refreshCompany }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
