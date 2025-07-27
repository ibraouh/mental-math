import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "../services/database";

export default function Profile() {
  const {
    user,
    profile,
    stats,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    refreshUserData,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [authError, setAuthError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editProfileIcon, setEditProfileIcon] = useState("");
  const [editError, setEditError] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error("Google sign in error:", error);
        alert(error.message);
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      alert("An error occurred during Google sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    try {
      const { error } = isSignUp
        ? await signUpWithEmail(email, password, username)
        : await signInWithEmail(email, password);

      if (error) {
        setAuthError(error.message);
      }
    } catch (error) {
      setAuthError("An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEditError("");

    try {
      const { error } = await updateProfile(user.uid, {
        display_name: editDisplayName,
        profile_icon: editProfileIcon,
      });

      if (error) {
        setEditError("Failed to update profile");
      } else {
        setIsEditing(false);
        await refreshUserData();
      }
    } catch (error) {
      setEditError("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = () => {
    setEditDisplayName(profile?.display_name || user.displayName || "");
    setEditProfileIcon(profile?.profile_icon || "🧮");
    setIsEditing(true);
    setEditError("");
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditDisplayName("");
    setEditProfileIcon("");
    setEditError("");
  };

  const getMembershipDuration = () => {
    if (!profile?.created_at) return "New member";

    const created = new Date(profile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `Member for ${diffDays} day${diffDays === 1 ? "" : "s"}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Member for ${months} month${months === 1 ? "" : "s"}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `Member for ${years} year${years === 1 ? "" : "s"}`;
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        console.error("Sign out error:", error);
        // Force sign out if Firebase is unresponsive
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Sign out error:", error);
      // Force sign out
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  // Show login form for logged out users
  if (!user) {
    return (
      <div className="ios-container ios-fade-in">
        <h1 className="ios-title">{isSignUp ? "Sign Up" : "Sign In"}</h1>
        <p className="ios-subtitle">Access your math progress</p>

        <div className="ios-section">
          <div className="ios-card">
            <form onSubmit={handleEmailAuth}>
              {isSignUp && (
                <div style={{ marginBottom: "16px" }}>
                  <label
                    className="ios-caption"
                    style={{ display: "block", marginBottom: "8px" }}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="ios-input"
                    placeholder="Enter username"
                    required={isSignUp}
                  />
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label
                  className="ios-caption"
                  style={{ display: "block", marginBottom: "8px" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ios-input"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  className="ios-caption"
                  style={{ display: "block", marginBottom: "8px" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ios-input"
                  placeholder="Enter password"
                  required
                />
              </div>

              {authError && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "rgba(255, 71, 87, 0.1)",
                    border: "1px solid rgba(255, 71, 87, 0.3)",
                    color: "#ff4757",
                    textAlign: "center",
                  }}
                >
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="ios-button"
                style={{ width: "100%", marginBottom: "16px" }}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <p className="ios-caption" style={{ color: "#8E8E93" }}>
                or
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="ios-button secondary"
              style={{ width: "100%", marginBottom: "16px" }}
              disabled={isLoading}
            >
              Continue with Google
            </button>

            <div style={{ textAlign: "center" }}>
              <p className="ios-caption" style={{ color: "#8E8E93" }}>
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setAuthError("");
                    setEmail("");
                    setPassword("");
                    setUsername("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#00ffff",
                    cursor: "pointer",
                    fontSize: "inherit",
                    fontFamily: "inherit",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show profile for logged in users
  return (
    <div className="ios-container ios-fade-in">
      <h1 className="ios-title">Profile</h1>
      <p className="ios-subtitle"></p>

      <div className="ios-section">
        <div
          className="ios-card"
          style={{ cursor: "pointer" }}
          onClick={!isEditing ? startEditing : undefined}
        >
          {!isEditing ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00ffff, #0080ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  flexShrink: 0,
                }}
              >
                {profile?.profile_icon || "🧮"}
              </div>

              <div style={{ flex: 1 }}>
                <h3 className="ios-heading" style={{ marginBottom: "4px" }}>
                  {profile?.display_name || user.displayName || "Math Learner"}
                </h3>
                <p
                  className="ios-body"
                  style={{ color: "#8E8E93", marginBottom: "4px" }}
                >
                  {user.email}
                </p>
                <p
                  className="ios-caption"
                  style={{ color: "#8E8E93", fontSize: "12px" }}
                >
                  {getMembershipDuration()}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEditProfile}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #00ffff, #0080ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    flexShrink: 0,
                  }}
                >
                  {editProfileIcon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: "8px" }}>
                    <label
                      className="ios-caption"
                      style={{ display: "block", marginBottom: "4px" }}
                    >
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                      className="ios-input"
                      placeholder="Enter display name"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <label
                      className="ios-caption"
                      style={{ display: "block", marginBottom: "4px" }}
                    >
                      Profile Icon
                    </label>
                    <input
                      type="text"
                      value={editProfileIcon}
                      onChange={(e) => setEditProfileIcon(e.target.value)}
                      className="ios-input"
                      placeholder="Enter emoji (e.g., 🧮)"
                      required
                    />
                  </div>
                </div>
              </div>

              {editError && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "rgba(255, 71, 87, 0.1)",
                    border: "1px solid rgba(255, 71, 87, 0.3)",
                    color: "#ff4757",
                    textAlign: "center",
                  }}
                >
                  {editError}
                </div>
              )}

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="ios-button secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ios-button"
                  style={{ flex: 1 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="ios-section">
        <div className="ios-card">
          <h3 className="ios-heading" style={{ marginBottom: "15px" }}>
            Statistics
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                background: "rgba(0, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
                border: "1px solid rgba(0, 255, 255, 0.2)",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>📊</div>
              <p className="ios-caption">Total Questions</p>
              <p
                className="ios-body"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {stats?.totalQuestions || 0}
              </p>
            </div>

            <div
              style={{
                background: "rgba(0, 255, 136, 0.1)",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
                border: "1px solid rgba(0, 255, 136, 0.2)",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>✅</div>
              <p className="ios-caption">Correct</p>
              <p
                className="ios-body"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {stats?.correctAnswers || 0}
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 193, 7, 0.1)",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
                border: "1px solid rgba(255, 193, 7, 0.2)",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>🎯</div>
              <p className="ios-caption">Accuracy</p>
              <p
                className="ios-body"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {stats?.accuracy || 0}%
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 71, 87, 0.1)",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
                border: "1px solid rgba(255, 71, 87, 0.2)",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>⭐</div>
              <p className="ios-caption">Level</p>
              <p
                className="ios-body"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {stats?.level || 1}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="ios-section">
        <button
          onClick={handleSignOut}
          className="ios-button secondary"
          style={{ width: "100%" }}
          disabled={isLoading}
        >
          {isLoading ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
