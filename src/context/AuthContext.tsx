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

const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_101',
  email: 'alex.smith@kalatrack.edu',
  full_name: 'Dr. Alex Smith',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  phone: '+1 (555) 234-5678',
  institution: 'Apex Institute of Technology',
  designation: 'Dean of Student Affairs',
  bio: 'Overseeing campus cultural arts festivals and student development programs.',
  is_email_verified: true,
  system_role: 'college_admin',
  created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_DEVICES: UserSessionDevice[] = [
  {
    id: 'dev_1',
    device_name: 'MacBook Pro 16"',
    browser: 'Chrome 122.0',
    ip_address: '192.168.1.45',
    last_active: 'Just now',
    is_current: true,
  },
  {
    id: 'dev_2',
    device_name: 'iPhone 15 Pro',
    browser: 'Safari Mobile',
    ip_address: '172.56.21.90',
    last_active: '2 hours ago',
    is_current: false,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kalatrack_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<UserSessionDevice[]>(DEFAULT_DEVICES);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile as UserProfile);
            }
          }
        } catch (err) {
          console.warn('Supabase auth check fallback:', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('kalatrack_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kalatrack_user');
    }
  }, [user]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setUser(profile as UserProfile);
        } else {
          const newProf: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: email.split('@')[0],
            is_email_verified: Boolean(data.user.email_confirmed_at),
            system_role: 'college_admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(newProf);
        }
      }
      setLoading(false);
      return { success: true };
    }

    // Local simulated login
    await new Promise((r) => setTimeout(r, 600));
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      email,
      full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
    };
    setUser(newUser);
    setLoading(false);
    return { success: true };
  };

  const register = async (email: string, pass: string, fullName: string, role: AppRole = 'college_admin') => {
    setLoading(true);
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { full_name: fullName, system_role: role } },
      });
      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }
      if (data.user) {
        const newProf: UserProfile = {
          id: data.user.id,
          email,
          full_name: fullName,
          is_email_verified: false,
          system_role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(newProf);
      }
      setLoading(false);
      return { success: true };
    }

    // Simulated registration
    await new Promise((r) => setTimeout(r, 700));
    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substr(2, 8),
      email,
      full_name: fullName,
      is_email_verified: false,
      system_role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(newUser);
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
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { success: false, error: error.message };
    }
    await new Promise((r) => setTimeout(r, 500));
    return { success: true };
  };

  const resetPassword = async (newPass: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) return { success: false, error: error.message };
    }
    await new Promise((r) => setTimeout(r, 500));
    return { success: true };
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setUser({
      ...DEFAULT_USER,
      full_name: 'Google Auth User',
      email: 'user.google@kalatrack.edu',
    });
    setLoading(false);
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

  const switchRole = (newRole: AppRole) => {
    if (!user) return;
    setUser({ ...user, system_role: newRole });
  };

  const revokeDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
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
        devices,
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
