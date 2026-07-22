import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AppRole, UserSessionDevice } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, pass: string, fullName: string, role?: AppRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: () => Promise<void>;
  switchRole: (newRole: AppRole) => void;
  devices: UserSessionDevice[];
  revokeDevice: (id: string) => void;
  isSupabaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string, emailStr?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setUser(data as UserProfile);
      } else if (emailStr) {
        // Fallback profile object if trigger hasn't populated yet
        const fallbackProf: UserProfile = {
          id: userId,
          email: emailStr,
          full_name: emailStr.split('@')[0],
          is_email_verified: true,
          system_role: 'college_admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(fallbackProf);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setLoading(false);
      return { success: false, error: 'Supabase is not configured in environment.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }

    if (data.user) {
      await fetchProfile(data.user.id, data.user.email);
    }

    setLoading(false);
    return { success: true };
  };

  const register = async (email: string, pass: string, fullName: string, role: AppRole = 'college_admin') => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setLoading(false);
      return { success: false, error: 'Supabase is not configured in environment.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pass,
      options: {
        data: {
          full_name: fullName.trim(),
          role: role,
        },
      },
    });

    if (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Upsert profile manually to guarantee existence
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: email.trim(),
        full_name: fullName.trim(),
        system_role: role,
        updated_at: new Date().toISOString(),
      });
      await fetchProfile(data.user.id, email.trim());
    }

    setLoading(false);
    return { success: true };
  };

  const logout = async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setLoading(false);
  };

  const forgotPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const resetPassword = async (newPass: string) => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' };
    }
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No authenticated user' };
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) return { success: false, error: error.message };
    }

    setUser(updated);
    return { success: true };
  };

  const verifyEmail = async () => {
    if (!user) return;
    setUser({ ...user, is_email_verified: true });
  };

  const switchRole = (_newRole: AppRole) => {
    // Role switching is disabled in production to enforce real DB permissions
    console.warn('Role switching is disabled. Roles are enforced from database organization memberships.');
  };

  const revokeDevice = (_id: string) => {
    // Session device management coming later
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        loginWithGoogle,
        updateProfile,
        verifyEmail,
        switchRole,
        devices: [],
        revokeDevice,
        isSupabaseConnected: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
