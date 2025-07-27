import React from "react";
import { useAuth } from "../contexts/AuthContext";
import LockedPage from "../components/LockedPage";

const AITrain = React.memo(() => {
  const { user } = useAuth();

  // If user is not authenticated, show locked page
  if (!user) {
    return (
      <LockedPage
        title="AI Training"
        description="Get personalized math problems and explanations powered by AI. Sign in to unlock this advanced feature."
      />
    );
  }

  return (
    <div className="ios-container ios-fade-in">
      <h1 className="ios-title">AI Training</h1>
      <p className="ios-subtitle">
        Coming Soon - AI-powered personalized learning
      </p>

      <div className="ios-section">
        <h3 className="ios-heading" style={{ marginBottom: "16px" }}>
          Planned Features
        </h3>

        <div style={{ display: "grid", gap: "12px" }}>
          <div className="ios-card" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "24px" }}>🎯</div>
              <div>
                <h4
                  className="ios-body"
                  style={{ fontWeight: "600", marginBottom: "4px" }}
                >
                  Adaptive Difficulty
                </h4>
                <p className="ios-caption">
                  Questions that automatically adjust to your skill level
                </p>
              </div>
            </div>
          </div>

          <div className="ios-card" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "24px" }}>💡</div>
              <div>
                <h4
                  className="ios-body"
                  style={{ fontWeight: "600", marginBottom: "4px" }}
                >
                  Step-by-Step Explanations
                </h4>
                <p className="ios-caption">
                  Detailed solutions and learning tips for every problem
                </p>
              </div>
            </div>
          </div>

          <div className="ios-card" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "24px" }}>🎨</div>
              <div>
                <h4
                  className="ios-body"
                  style={{ fontWeight: "600", marginBottom: "4px" }}
                >
                  Custom Problem Types
                </h4>
                <p className="ios-caption">
                  Generate problems for specific topics you want to practice
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AITrain;
