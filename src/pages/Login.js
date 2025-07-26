import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, username);
        if (error) throw error;
        // Show success message for sign up
        alert("Check your email for the confirmation link!");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/profile");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ios-container ios-fade-in">
      <h1 className="ios-title">{isSignUp ? "Sign Up" : "Welcome Back"}</h1>
      <p className="ios-subtitle">
        {isSignUp
          ? "Create your account to track your progress"
          : "Sign in to continue your math journey"}
      </p>

      <div className="ios-section">
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="ios-spacing-sm">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="ios-input"
                placeholder="Username"
                required={isSignUp}
              />
            </div>
          )}

          <div className="ios-spacing-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ios-input"
              placeholder="Email address"
              required
            />
          </div>

          <div className="ios-spacing-sm">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ios-input"
              placeholder="Password"
              required
            />
          </div>

          {error && (
            <div className="ios-spacing-sm">
              <p className="ios-error">{error}</p>
            </div>
          )}

          <div className="ios-spacing-md">
            <button
              type="submit"
              className="ios-button"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </div>
        </form>
      </div>

      <div className="ios-section">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="ios-button secondary"
          style={{ width: "100%" }}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Need an account? Sign Up"}
        </button>
      </div>

      {!isSignUp && (
        <div className="ios-section">
          <p className="ios-caption" style={{ textAlign: "center" }}>
            Forgot your password? Contact support.
          </p>
        </div>
      )}
    </div>
  );
}
