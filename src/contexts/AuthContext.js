import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  initializeUserProfile,
  getProfile,
  calculateStats,
} from "../services/database";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile and stats
  const loadUserData = async (user) => {
    if (!user) {
      setProfile(null);
      setStats(null);
      return;
    }

    try {
      // Initialize profile if needed
      await initializeUserProfile(user);

      // Load profile
      const { data: profileData } = await getProfile(user.id);
      setProfile(profileData);

      // Calculate stats
      const { data: statsData } = await calculateStats(user.id);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserData(session.user);
      } else {
        setProfile(null);
        setStats(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user);
    }
  };

  const value = {
    user,
    profile,
    stats,
    signUp,
    signIn,
    signOut,
    loading,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
