import { supabase } from "../lib/supabase";

// Profile operations with fallback to localStorage
export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.warn("Supabase profile fetch failed, using localStorage:", error);
      // Fallback to localStorage
      const localProfile = localStorage.getItem(`profile_${userId}`);
      return {
        data: localProfile ? JSON.parse(localProfile) : null,
        error: null,
      };
    }

    return { data, error };
  } catch (err) {
    console.warn("Profile fetch error, using localStorage:", err);
    const localProfile = localStorage.getItem(`profile_${userId}`);
    return {
      data: localProfile ? JSON.parse(localProfile) : null,
      error: null,
    };
  }
};

export const createProfile = async (userId, username) => {
  try {
    const profileData = {
      id: userId,
      username,
      level: 1,
      total_questions: 0,
      correct_answers: 0,
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.warn(
        "Supabase profile creation failed, using localStorage:",
        error
      );
      // Fallback to localStorage
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
      return { data: profileData, error: null };
    }

    // Also save to localStorage as backup
    localStorage.setItem(`profile_${userId}`, JSON.stringify(data));
    return { data, error };
  } catch (err) {
    console.warn("Profile creation error, using localStorage:", err);
    const profileData = {
      id: userId,
      username,
      level: 1,
      total_questions: 0,
      correct_answers: 0,
    };
    localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
    return { data: profileData, error: null };
  }
};

export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.warn(
        "Supabase profile update failed, using localStorage:",
        error
      );
      // Fallback to localStorage
      const localProfile = localStorage.getItem(`profile_${userId}`);
      const updatedProfile = localProfile
        ? { ...JSON.parse(localProfile), ...updates }
        : updates;
      localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedProfile));
      return { data: updatedProfile, error: null };
    }

    // Also save to localStorage as backup
    localStorage.setItem(`profile_${userId}`, JSON.stringify(data));
    return { data, error };
  } catch (err) {
    console.warn("Profile update error, using localStorage:", err);
    const localProfile = localStorage.getItem(`profile_${userId}`);
    const updatedProfile = localProfile
      ? { ...JSON.parse(localProfile), ...updates }
      : updates;
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedProfile));
    return { data: updatedProfile, error: null };
  }
};

// Simplified question history (localStorage only for now)
export const addQuestionHistory = async (questionData) => {
  try {
    const { data, error } = await supabase
      .from("question_history")
      .insert([questionData])
      .select()
      .single();

    if (error) {
      console.warn(
        "Supabase question history failed, using localStorage:",
        error
      );
      // Fallback to localStorage
      const history = JSON.parse(
        localStorage.getItem("question_history") || "[]"
      );
      history.push({
        ...questionData,
        id: Date.now(),
        created_at: new Date().toISOString(),
      });
      localStorage.setItem("question_history", JSON.stringify(history));
      return { data: questionData, error: null };
    }

    return { data, error };
  } catch (err) {
    console.warn("Question history error, using localStorage:", err);
    const history = JSON.parse(
      localStorage.getItem("question_history") || "[]"
    );
    history.push({
      ...questionData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("question_history", JSON.stringify(history));
    return { data: questionData, error: null };
  }
};

export const getQuestionHistory = async (userId, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from("question_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn(
        "Supabase question history fetch failed, using localStorage:",
        error
      );
      // Fallback to localStorage
      const history = JSON.parse(
        localStorage.getItem("question_history") || "[]"
      );
      const userHistory = history
        .filter((q) => q.user_id === userId)
        .slice(0, limit);
      return { data: userHistory, error: null };
    }

    return { data, error };
  } catch (err) {
    console.warn("Question history fetch error, using localStorage:", err);
    const history = JSON.parse(
      localStorage.getItem("question_history") || "[]"
    );
    const userHistory = history
      .filter((q) => q.user_id === userId)
      .slice(0, limit);
    return { data: userHistory, error: null };
  }
};

// Simplified achievements (localStorage only for now)
export const addAchievement = async (userId, achievementType) => {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .insert([
        {
          user_id: userId,
          achievement_type: achievementType,
        },
      ])
      .select()
      .single();

    if (error) {
      console.warn("Supabase achievement failed, using localStorage:", error);
      // Fallback to localStorage
      const achievements = JSON.parse(
        localStorage.getItem("achievements") || "[]"
      );
      achievements.push({
        user_id: userId,
        achievement_type: achievementType,
        id: Date.now(),
        earned_at: new Date().toISOString(),
      });
      localStorage.setItem("achievements", JSON.stringify(achievements));
      return {
        data: { user_id: userId, achievement_type: achievementType },
        error: null,
      };
    }

    return { data, error };
  } catch (err) {
    console.warn("Achievement error, using localStorage:", err);
    const achievements = JSON.parse(
      localStorage.getItem("achievements") || "[]"
    );
    achievements.push({
      user_id: userId,
      achievement_type: achievementType,
      id: Date.now(),
      earned_at: new Date().toISOString(),
    });
    localStorage.setItem("achievements", JSON.stringify(achievements));
    return {
      data: { user_id: userId, achievement_type: achievementType },
      error: null,
    };
  }
};

export const getAchievements = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    if (error) {
      console.warn(
        "Supabase achievements fetch failed, using localStorage:",
        error
      );
      // Fallback to localStorage
      const achievements = JSON.parse(
        localStorage.getItem("achievements") || "[]"
      );
      const userAchievements = achievements.filter((a) => a.user_id === userId);
      return { data: userAchievements, error: null };
    }

    return { data, error };
  } catch (err) {
    console.warn("Achievements fetch error, using localStorage:", err);
    const achievements = JSON.parse(
      localStorage.getItem("achievements") || "[]"
    );
    const userAchievements = achievements.filter((a) => a.user_id === userId);
    return { data: userAchievements, error: null };
  }
};

// Statistics helpers
export const calculateStats = async (userId) => {
  try {
    const { data: history, error: historyError } = await getQuestionHistory(
      userId
    );

    if (historyError) {
      console.warn("Stats calculation error:", historyError);
      return {
        data: { totalQuestions: 0, correctAnswers: 0, accuracy: 0, level: 1 },
        error: null,
      };
    }

    const totalQuestions = history.length;
    const correctAnswers = history.filter((q) => q.is_correct).length;
    const accuracy =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
    const level = Math.floor(totalQuestions / 20) + 1;

    return {
      data: {
        totalQuestions,
        correctAnswers,
        accuracy,
        level,
      },
      error: null,
    };
  } catch (err) {
    console.warn("Stats calculation error:", err);
    return {
      data: { totalQuestions: 0, correctAnswers: 0, accuracy: 0, level: 1 },
      error: null,
    };
  }
};

// Initialize user profile if it doesn't exist
export const initializeUserProfile = async (user) => {
  try {
    const { data: existingProfile } = await getProfile(user.id);

    if (!existingProfile) {
      const username =
        user.user_metadata?.username ||
        user.email?.split("@")[0] ||
        "Math Learner";
      await createProfile(user.id, username);
    }
  } catch (err) {
    console.warn("Profile initialization error:", err);
    // Try to create profile anyway
    const username =
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      "Math Learner";
    await createProfile(user.id, username);
  }
};
