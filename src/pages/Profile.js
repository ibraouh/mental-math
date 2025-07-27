import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user, profile, stats, signInWithGoogle, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
        <h1 className="ios-title">Sign In</h1>
        <p className="ios-subtitle">Access your math progress</p>

        <div className="ios-section">
          <div className="ios-card">
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4285F4, #34A853)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  fontSize: "32px",
                }}
              >
                🔐
              </div>
              <p
                className="ios-body"
                style={{ color: "#8E8E93", marginBottom: "24px" }}
              >
                Sign in with your Google account to track your math progress and
                unlock all features.
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="ios-button"
              style={{ width: "100%" }}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Continue with Google"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show profile for logged in users
  return (
    <div className="ios-container ios-fade-in">
      <h1 className="ios-title">Profile</h1>

      <div className="ios-section">
        <div className="ios-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
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
            </div>
          </div>
        </div>
      </div>

      <div className="ios-section">
        <div className="ios-card">
          <h3 className="ios-heading" style={{ marginBottom: "16px" }}>
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
            <div style={{ textAlign: "center" }}>
              <p className="ios-caption">Total Questions</p>
              <p
                className="ios-body"
                style={{ fontSize: "24px", fontWeight: "600" }}
              >
                {stats?.totalQuestions || 0}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p className="ios-caption">Correct Answers</p>
              <p
                className="ios-body"
                style={{ fontSize: "24px", fontWeight: "600" }}
              >
                {stats?.correctAnswers || 0}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p className="ios-caption">Accuracy</p>
              <p
                className="ios-body"
                style={{ fontSize: "24px", fontWeight: "600" }}
              >
                {stats?.accuracy || 0}%
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p className="ios-caption">Level</p>
              <p
                className="ios-body"
                style={{ fontSize: "24px", fontWeight: "600" }}
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
