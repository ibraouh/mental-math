import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// Get user profile from Firestore
export const getProfile = async (userId) => {
  try {
    const profileRef = doc(db, "profiles", userId);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      return { data: profileSnap.data(), error: null };
    } else {
      return { data: null, error: null };
    }
  } catch (err) {
    console.warn("Firestore getProfile error:", err);
    // Fallback to localStorage
    const stored = localStorage.getItem(`profile_${userId}`);
    return { data: stored ? JSON.parse(stored) : null, error: err };
  }
};

// Create user profile in Firestore
export const createProfile = async (userId, profileData) => {
  try {
    const defaultProfile = {
      display_name: profileData?.display_name || "Math Learner",
      profile_icon: profileData?.profile_icon || "🧮",
      total_questions: 0,
      correct_answers: 0,
      level: 1,
      wrong_answers: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const profileRef = doc(db, "profiles", userId);
    await setDoc(profileRef, defaultProfile);

    // Also store in localStorage as backup
    localStorage.setItem(`profile_${userId}`, JSON.stringify(defaultProfile));

    return { data: defaultProfile, error: null };
  } catch (err) {
    console.warn("Firestore createProfile error:", err);
    // Fallback to localStorage only
    const defaultProfile = {
      display_name: profileData?.display_name || "Math Learner",
      profile_icon: profileData?.profile_icon || "🧮",
      total_questions: 0,
      correct_answers: 0,
      level: 1,
      wrong_answers: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(defaultProfile));
    return { data: defaultProfile, error: err };
  }
};

// Update user profile in Firestore
export const updateProfile = async (userId, updates) => {
  try {
    const profileRef = doc(db, "profiles", userId);
    await updateDoc(profileRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    // Update localStorage backup
    const current = localStorage.getItem(`profile_${userId}`);
    const currentData = current ? JSON.parse(current) : {};
    const updatedData = {
      ...currentData,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedData));

    return { data: updatedData, error: null };
  } catch (err) {
    console.warn("Firestore updateProfile error:", err);
    // Fallback to localStorage only
    const current = localStorage.getItem(`profile_${userId}`);
    const currentData = current ? JSON.parse(current) : {};
    const updatedData = {
      ...currentData,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedData));
    return { data: updatedData, error: err };
  }
};

// Add wrong answer to user's profile
export const addWrongAnswer = async (userId, question) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const { data: currentProfile } = await getProfile(userId);
    const wrongAnswers = currentProfile?.wrong_answers || {};

    if (!wrongAnswers[today]) {
      wrongAnswers[today] = [];
    }
    wrongAnswers[today].push(question);

    const profileRef = doc(db, "profiles", userId);
    await updateDoc(profileRef, {
      wrong_answers: wrongAnswers,
      updated_at: new Date().toISOString(),
    });

    // Update localStorage backup
    const current = localStorage.getItem(`profile_${userId}`);
    const currentData = current ? JSON.parse(current) : {};
    const updatedData = {
      ...currentData,
      wrong_answers: wrongAnswers,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedData));

    return { data: wrongAnswers, error: null };
  } catch (err) {
    console.warn("Firestore addWrongAnswer error:", err);
    // Fallback to localStorage only
    const today = new Date().toISOString().split("T")[0];
    const current = localStorage.getItem(`profile_${userId}`);
    const currentData = current ? JSON.parse(current) : {};
    const wrongAnswers = currentData.wrong_answers || {};

    if (!wrongAnswers[today]) {
      wrongAnswers[today] = [];
    }
    wrongAnswers[today].push(question);

    const updatedData = {
      ...currentData,
      wrong_answers: wrongAnswers,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedData));
    return { data: wrongAnswers, error: err };
  }
};

// Update user stats (total questions and correct answers)
export const updateUserStats = async (userId, isCorrect) => {
  try {
    const { data: currentProfile } = await getProfile(userId);
    const updates = {
      total_questions: (currentProfile?.total_questions || 0) + 1,
      correct_answers:
        (currentProfile?.correct_answers || 0) + (isCorrect ? 1 : 0),
      updated_at: new Date().toISOString(),
    };

    const profileRef = doc(db, "profiles", userId);
    await updateDoc(profileRef, updates);

    // Update localStorage backup
    const current = localStorage.getItem(`profile_${userId}`);
    const currentData = current ? JSON.parse(current) : {};
    const updatedData = { ...currentData, ...updates };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedData));

    return { data: updatedData, error: null };
  } catch (err) {
    console.warn("Firestore updateUserStats error:", err);
    // Fallback to localStorage only
    const current = localStorage.getItem(`profile_${userId}`);
    const currentData = current ? JSON.parse(current) : {};
    const updates = {
      total_questions: (currentData.total_questions || 0) + 1,
      correct_answers: (currentData.correct_answers || 0) + (isCorrect ? 1 : 0),
      updated_at: new Date().toISOString(),
    };
    const updatedData = { ...currentData, ...updates };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedData));
    return { data: updatedData, error: err };
  }
};

// Calculate user statistics
export const calculateStats = async (userId) => {
  try {
    const { data: profile } = await getProfile(userId);
    if (!profile) {
      return {
        data: { totalQuestions: 0, correctAnswers: 0, accuracy: 0, level: 1 },
        error: null,
      };
    }

    const totalQuestions = profile.total_questions || 0;
    const correctAnswers = profile.correct_answers || 0;
    const accuracy =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
    const level = profile.level || 1;

    return {
      data: { totalQuestions, correctAnswers, accuracy, level },
      error: null,
    };
  } catch (err) {
    console.warn("Firestore calculateStats error:", err);
    // Fallback to localStorage
    const stored = localStorage.getItem(`profile_${userId}`);
    if (!stored) {
      return {
        data: { totalQuestions: 0, correctAnswers: 0, accuracy: 0, level: 1 },
        error: null,
      };
    }

    const profile = JSON.parse(stored);
    const totalQuestions = profile.total_questions || 0;
    const correctAnswers = profile.correct_answers || 0;
    const accuracy =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
    const level = profile.level || 1;

    return {
      data: { totalQuestions, correctAnswers, accuracy, level },
      error: null,
    };
  }
};

// Initialize user profile if it doesn't exist
export const initializeUserProfile = async (user) => {
  try {
    const { data: existingProfile } = await getProfile(user.uid);

    if (!existingProfile) {
      const profileData = {
        display_name:
          user.displayName || user.email?.split("@")[0] || "Math Learner",
        profile_icon: "🧮",
      };
      await createProfile(user.uid, profileData);
    }
  } catch (err) {
    console.warn("Profile initialization error:", err);
    // Try to create profile anyway
    const profileData = {
      display_name:
        user.displayName || user.email?.split("@")[0] || "Math Learner",
      profile_icon: "🧮",
    };
    await createProfile(user.uid, profileData);
  }
};
