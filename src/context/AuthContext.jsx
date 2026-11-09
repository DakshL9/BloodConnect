import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
  user: null,
  profile: null,
  role: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      if (data) {
        setProfile(data);
        setRole(data.role || 'user');
      } else {
        setProfile(null);
        setRole('user');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setRole('user');
    }
  }, []);

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Session retrieval error:', err);
      setLoading(false);
    });

    // 2. Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data?.user) {
      await fetchProfile(data.user.id);
    }
    return { data, error };
  };

  const signup = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });
    return { data, error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
    return { error };
  };

  const value = {
    user,
    profile,
    role,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

