import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, profile, stats, signOut, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const forceSignOut = () => {
    // Clear any local storage or session data
    localStorage.clear();
    sessionStorage.clear();
    // Force page reload to clear any cached state
    window.location.href = "/";
  };

  const handleSignOut = async () => {
    setLoading(true);

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
      console.warn("Sign out timed out, forcing navigation");
      forceSignOut();
    }, 5000); // 5 second timeout

    try {
      const { error } = await signOut();
      clearTimeout(timeoutId);

      if (error) {
        console.error("Sign out error:", error);
        // Even if there's an error, we should still navigate to login
        forceSignOut();
      } else {
        // Successful sign out
        navigate("/");
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Error signing out:", error);
      // Force navigation even if there's an error
      forceSignOut();
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, username);
        if (error) {
          setError(error.message);
        } else {
          setError("Check your email for confirmation link!");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // If user is not authenticated, show login/signup form
  if (!user) {
    return (
      <div className="ios-container ios-fade-in">
        <h1 className="ios-title">Account</h1>
        <p className="ios-subtitle">
          Sign in or Sign up to unlock all features
        </p>

        <div className="ios-section">
          <div className="ios-card">
            <form onSubmit={handleAuth}>
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
                    required
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

              {error && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "rgba(255, 59, 48, 0.1)",
                    border: "1px solid rgba(255, 59, 48, 0.3)",
                    color: "#FF3B30",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="ios-button"
                disabled={loading}
                style={{ width: "100%", marginBottom: "16px" }}
              >
                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="ios-button secondary"
                style={{ width: "100%" }}
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Need an account? Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show profile info
  const displayName =
    profile?.username || user.user_metadata?.username || "Math Learner";
  const level = stats?.level || profile?.level || 1;
  const totalQuestions = stats?.totalQuestions || profile?.total_questions || 0;
  const correctAnswers = stats?.correctAnswers || profile?.correct_answers || 0;
  const accuracy = stats?.accuracy || 0;

  const statsData = [
    { label: "Total Questions", value: totalQuestions, icon: "📊" },
    { label: "Correct Answers", value: correctAnswers, icon: "✅" },
    { label: "Accuracy", value: `${accuracy}%`, icon: "🎯" },
    { label: "Current Level", value: level, icon: "⭐" },
  ];

  return (
    <div className="ios-container ios-fade-in">
      <h1 className="ios-title">Profile</h1>
      <p className="ios-subtitle"></p>

      {/* User Info Section */}
      <div className="ios-section">
        <div className="ios-card">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00ffff, #0080ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                flexShrink: 0,
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h2 className="ios-heading" style={{ marginBottom: "0px" }}>
                {displayName}
              </h2>
              <p className="ios-caption">{user.email}</p>
              <p className="ios-caption">
                Level {level} • {accuracy}% accuracy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="ios-section">
        <h3 className="ios-heading" style={{ marginBottom: "16px" }}>
          Statistics
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="ios-card"
              style={{ marginBottom: 0, textAlign: "center" }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                {stat.icon}
              </div>
              <p
                className="ios-body"
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </p>
              <p className="ios-caption">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="ios-section">
        <button
          onClick={handleSignOut}
          className="ios-button secondary"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
