import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile, User } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfileWithTimeout(userId: string, timeoutMs: number) {
    let timeoutHandle: any;
    const timeoutPromise = new Promise<void>((resolve) => {
      timeoutHandle = setTimeout(() => {
        console.warn('Profile fetch timeout, proceeding with UI');
        setLoading(false);
        resolve();
      }, timeoutMs);
    });
    await Promise.race([fetchProfile(userId), timeoutPromise]);
    clearTimeout(timeoutHandle);
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        if (data.session) {
          const user = data.session.user;
          setUser({
            id: user.id,
            email: user.email || '',
            user_metadata: user.user_metadata,
          });
          setLoading(true);
          fetchProfileWithTimeout(user.id, 4000);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state change:', event, newSession?.user?.email);
      setSession(newSession);

      if (newSession) {
        const user = newSession.user;
        setUser({
          id: user.id,
          email: user.email || '',
          user_metadata: user.user_metadata,
        });
        setLoading(true);
        fetchProfileWithTimeout(user.id, 4000);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for:', userId);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('Profile query result:', { data, error });

      if (error) {
        console.error('Profile fetch error:', error);
        // If there's a database error, create a minimal profile to prevent infinite loading
        const { data: userData } = await supabase.auth.getUser();
        const fallbackProfile: Profile = {
          id: 'temp-' + userId,
          user_id: userId,
          full_name: userData.user?.user_metadata?.full_name || 'User',
          role: 'user',
          account_status: 'tier1',
          verification_status: 'pending',
          payment_status: 'unverified',
          test_score: 0,
          total_earned: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(fallbackProfile);
        setLoading(false);
        return;
      }

      if (!data) {
        console.log('No profile found, creating one...');
        const { data: userData } = await supabase.auth.getUser();
        const fullName = userData.user?.user_metadata?.full_name || 'User';
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            full_name: fullName,
            role: 'user',
            account_status: 'a7F9xQ2mP6kM4rT5'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          // Create fallback profile if database insert fails
          const fallbackProfile: Profile = {
            id: 'temp-' + userId,
            user_id: userId,
            full_name: fullName,
            role: 'user',
            account_status: 'tier1',
            verification_status: 'pending',
            payment_status: 'unverified',
            test_score: 0,
            total_earned: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(fallbackProfile);
          setLoading(false);
          return;
        }

        console.log('Profile created successfully:', newProfile);
        setProfile(newProfile as Profile);
        setLoading(false);
        return;
      }
      
      console.log('Profile found:', data);
      setProfile(data as Profile);
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      // Create fallback profile to prevent infinite loading
      const fallbackProfile: Profile = {
        id: 'temp-' + userId,
        user_id: userId,
        full_name: 'User',
        role: 'user',
        account_status: 'tier1',
        verification_status: 'pending',
        payment_status: 'unverified',
        test_score: 0,
        total_earned: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(fallbackProfile);
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      console.log('Signing up:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) throw error;
      console.log('Signup successful:', data.user?.email);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Account doesn\'t exist. Please sign up instead.');
        }
        throw error;
      }



      console.log('Signin successful:', data.user?.email);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      
      // Clear all local storage and cache
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any cached data
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };



  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signOut, refreshProfile }}>
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
  
