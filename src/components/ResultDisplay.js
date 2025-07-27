import React from "react";

const ResultDisplay = ({
  result,
  question,
  userAnswer,
  answer,
  onNext,
  onRetry,
  showRetry = false,
}) => {
  const isCorrect = result === "correct";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "20px",
      }}
    >
      <div
        className="ios-card"
        style={{
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "64px",
            marginBottom: "16px",
          }}
        >
          {isCorrect ? "✅" : "❌"}
        </div>

        <h2
          className="ios-heading"
          style={{
            color: isCorrect ? "var(--success-color)" : "var(--error-color)",
            marginBottom: "16px",
          }}
        >
          {isCorrect ? "Correct!" : "Incorrect"}
        </h2>

        <div style={{ marginBottom: "24px" }}>
          <p className="ios-body" style={{ marginBottom: "8px" }}>
            Question: {question}
          </p>
          <p className="ios-body" style={{ marginBottom: "8px" }}>
            Your answer: {userAnswer}
          </p>
          {!isCorrect && (
            <p className="ios-body" style={{ color: "var(--success-color)" }}>
              Correct answer: {answer}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {showRetry && (
            <button
              onClick={onRetry}
              className="ios-button secondary"
              style={{ flex: 1 }}
            >
              Try Again
            </button>
          )}
          <button onClick={onNext} className="ios-button" style={{ flex: 1 }}>
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
