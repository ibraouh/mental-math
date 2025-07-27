import React from "react";
import { useNavigate } from "react-router-dom";

export default function LockedPage({ title, description, icon }) {
  const navigate = useNavigate();

  return (
    <div className="ios-container ios-fade-in">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8E8E93, #C7C7CC)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px auto",
            fontSize: "48px",
            opacity: 0.85,
          }}
        >
          🔒
        </div>

        <h1 className="ios-title" style={{ marginBottom: "16px" }}>
          {title}
        </h1>
        <p
          className="ios-body"
          style={{
            marginBottom: "32px",
            maxWidth: "300px",
            color: "#8E8E93",
          }}
        >
          {description}
        </p>

        <button
          onClick={() => navigate("/profile")}
          className="ios-button"
          style={{ width: "200px" }}
        >
          Sign In to Unlock
        </button>
      </div>
    </div>
  );
}
