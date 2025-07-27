import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  initializeUserProfile,
  getProfile,
  calculateStats,
} from "../services/database";

// Import ColorSchemeContext to access color scheme functions
let colorSchemeContext = null;
export const setColorSchemeContext = (context) => {
  colorSchemeContext = context;
};

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

// Cache auth state in localStorage
const AUTH_CACHE_KEY = "mental_math_auth_cache";
const PROFILE_CACHE_KEY = "mental_math_profile_cache";
const STATS_CACHE_KEY = "mental_math_stats_cache";
const AUTH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedAuthState = () => {
  try {
    const cached = localStorage.getItem(AUTH_CACHE_KEY);
    if (!cached) return null;

    const { user, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid (within 5 minutes)
    if (now - timestamp < AUTH_CACHE_DURATION) {
      return user;
    }

    // Cache expired, remove it
    localStorage.removeItem(AUTH_CACHE_KEY);
    return null;
  } catch (error) {
    console.warn("Error reading auth cache:", error);
    return null;
  }
};

const getCachedProfile = () => {
  try {
    const cached = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!cached) return null;

    const { profile, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid (within 5 minutes)
    if (now - timestamp < AUTH_CACHE_DURATION) {
      return profile;
    }

    // Cache expired, remove it
    localStorage.removeItem(PROFILE_CACHE_KEY);
    return null;
  } catch (error) {
    console.warn("Error reading profile cache:", error);
    return null;
  }
};

const getCachedStats = () => {
  try {
    const cached = localStorage.getItem(STATS_CACHE_KEY);
    if (!cached) return null;

    const { stats, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid (within 5 minutes)
    if (now - timestamp < AUTH_CACHE_DURATION) {
      return stats;
    }

    // Cache expired, remove it
    localStorage.removeItem(STATS_CACHE_KEY);
    return null;
  } catch (error) {
    console.warn("Error reading stats cache:", error);
    return null;
  }
};

const setCachedAuthState = (user) => {
  try {
    if (user) {
      const cacheData = {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        timestamp: Date.now(),
      };
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cacheData));
    } else {
      localStorage.removeItem(AUTH_CACHE_KEY);
    }
  } catch (error) {
    console.warn("Error setting auth cache:", error);
  }
};

const setCachedProfile = (profile) => {
  try {
    if (profile) {
      const cacheData = {
        profile,
        timestamp: Date.now(),
      };
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cacheData));
    } else {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    }
  } catch (error) {
    console.warn("Error setting profile cache:", error);
  }
};

const setCachedStats = (stats) => {
  try {
    if (stats) {
      const cacheData = {
        stats,
        timestamp: Date.now(),
      };
      localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(cacheData));
    } else {
      localStorage.removeItem(STATS_CACHE_KEY);
    }
  } catch (error) {
    console.warn("Error setting stats cache:", error);
  }
};

const clearAllCaches = () => {
  try {
    localStorage.removeItem(AUTH_CACHE_KEY);
    localStorage.removeItem(PROFILE_CACHE_KEY);
    localStorage.removeItem(STATS_CACHE_KEY);
  } catch (error) {
    console.warn("Error clearing caches:", error);
  }
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
      const { data: profileData } = await getProfile(user.uid);
      setProfile(profileData);
      setCachedProfile(profileData);

      // Apply user's color scheme preference if available
      if (profileData?.color_scheme && colorSchemeContext) {
        colorSchemeContext.changeColorScheme(profileData.color_scheme);
      }

      // Calculate stats
      const { data: statsData } = await calculateStats(user.uid);
      setStats(statsData);
      setCachedStats(statsData);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    // First, try to get cached data for immediate response
    const cachedUser = getCachedAuthState();
    const cachedProfile = getCachedProfile();
    const cachedStats = getCachedStats();

    if (cachedUser) {
      console.log("Using cached auth state:", cachedUser.email);
      setUser(cachedUser);

      if (cachedProfile) {
        console.log("Using cached profile data");
        setProfile(cachedProfile);
      }

      if (cachedStats) {
        console.log("Using cached stats data");
        setStats(cachedStats);
      }

      setLoading(false);

      // Load fresh data in background
      loadUserData(cachedUser);
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? user.email : "no user");

      // Update cache
      setCachedAuthState(user);

      setUser(user);
      if (user) {
        await loadUserData(user);
      } else {
        setProfile(null);
        setStats(null);
        clearAllCaches();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUpWithEmail = async (email, password, username) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Update the user's display name
      if (result.user) {
        await updateProfile(result.user, {
          displayName: username,
        });
      }
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // Clear all caches immediately
      clearAllCaches();
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
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
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    loading,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
