import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import LockedPage from "../components/LockedPage";

export default function Timed() {
  const { user } = useAuth();
  const [difficulty, setDifficulty] = useState("easy");
  const [mode, setMode] = useState("addition");
  const [timeLimit, setTimeLimit] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const generateQuestion = () => {
    let num1, num2, operation, result;

    // If mode is random, select a random operation
    const currentMode =
      mode === "random"
        ? ["addition", "subtraction", "multiplication", "division"][
            Math.floor(Math.random() * 4)
          ]
        : mode;

    switch (currentMode) {
      case "addition":
        if (difficulty === "easy") {
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * 50) + 1;
        } else if (difficulty === "medium") {
          num1 = Math.floor(Math.random() * 100) + 1;
          num2 = Math.floor(Math.random() * 100) + 1;
        } else {
          num1 = Math.floor(Math.random() * 500) + 1;
          num2 = Math.floor(Math.random() * 500) + 1;
        }
        operation = "+";
        result = num1 + num2;
        break;
      case "subtraction":
        if (difficulty === "easy") {
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * num1) + 1;
        } else if (difficulty === "medium") {
          num1 = Math.floor(Math.random() * 100) + 1;
          num2 = Math.floor(Math.random() * num1) + 1;
        } else {
          num1 = Math.floor(Math.random() * 500) + 1;
          num2 = Math.floor(Math.random() * num1) + 1;
        }
        operation = "-";
        result = num1 - num2;
        break;
      case "multiplication":
        if (difficulty === "easy") {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
        } else if (difficulty === "medium") {
          num1 = Math.floor(Math.random() * 25) + 1;
          num2 = Math.floor(Math.random() * 25) + 1;
        } else {
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * 50) + 1;
        }
        operation = "×";
        result = num1 * num2;
        break;
      case "division":
        if (difficulty === "easy") {
          num2 = Math.floor(Math.random() * 12) + 1;
          result = Math.floor(Math.random() * 12) + 1;
          num1 = num2 * result;
        } else if (difficulty === "medium") {
          num2 = Math.floor(Math.random() * 25) + 1;
          result = Math.floor(Math.random() * 25) + 1;
          num1 = num2 * result;
        } else {
          num2 = Math.floor(Math.random() * 50) + 1;
          result = Math.floor(Math.random() * 50) + 1;
          num1 = num2 * result;
        }
        operation = "÷";
        break;
      default:
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        operation = "+";
        result = num1 + num2;
    }

    setQuestion(`${num1} ${operation} ${num2}`);
    setAnswer(result.toString());
    setUserAnswer("");
  };

  const endChallenge = useCallback(() => {
    setIsActive(false);
    setShowResults(true);
  }, [correctCount, mistakes, mode]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endChallenge();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, endChallenge]);

  const startChallenge = () => {
    setTimeLeft(timeLimit);
    setCorrectCount(0);
    setMistakes(0);
    setShowResults(false);
    setIsActive(true);
    generateQuestion();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userAnswer === answer) {
      setCorrectCount(correctCount + 1);
    } else {
      setMistakes(mistakes + 1);
    }
    generateQuestion();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // If user is not authenticated, show locked page
  if (!user) {
    return (
      <LockedPage
        title="Timed Challenges"
        description="Test your speed and accuracy with timed math challenges. Sign in to unlock this feature and track your progress."
      />
    );
  }

  if (showResults) {
    return (
      <div className="ios-container ios-fade-in">
        <h1 className="ios-title">Timed Challenge</h1>
        <p className="ios-subtitle"></p>
        <div className="ios-section">
          <div className="ios-card">
            <div style={{ textAlign: "center" }}>
              <h2 className="ios-heading" style={{ marginBottom: "24px" }}>
                {correctCount > mistakes
                  ? "Great Job! 🎉"
                  : "Keep Practicing! 💪"}
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                    ✅
                  </div>
                  <p
                    className="ios-body"
                    style={{ fontSize: "24px", fontWeight: "600" }}
                  >
                    {correctCount}
                  </p>
                  <p className="ios-caption">Correct</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                    ❌
                  </div>
                  <p
                    className="ios-body"
                    style={{ fontSize: "24px", fontWeight: "600" }}
                  >
                    {mistakes}
                  </p>
                  <p className="ios-caption">Mistakes</p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <button onClick={startChallenge} className="ios-button">
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setIsActive(false);
                  }}
                  className="ios-button secondary"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ios-container ios-fade-in">
      <h1 className="ios-title">Timed Challenge</h1>
      <p className="ios-subtitle"></p>
      {!isActive ? (
        <div className="ios-section">
          <div className="ios-card">
            <h3 className="ios-heading" style={{ marginBottom: "16px" }}>
              Settings
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label
                className="ios-caption"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="ios-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                className="ios-caption"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Operation
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="ios-select"
              >
                <option value="addition">Addition</option>
                <option value="subtraction">Subtraction</option>
                <option value="multiplication">Multiplication</option>
                <option value="division">Division</option>
                <option value="random">Random</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                className="ios-caption"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Time Limit
              </label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="ios-select"
                style={{ width: "100%" }}
              >
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>

            <button
              onClick={startChallenge}
              className="ios-button"
              style={{ width: "100%" }}
            >
              Start Challenge
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="ios-section">
            <div className="ios-card">
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <button
                  onClick={endChallenge}
                  className="ios-button secondary"
                  style={{ width: "100%", marginBottom: "15px" }}
                >
                  Stop Challenge
                </button>
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "10px",
                    color: timeLeft <= 10 ? "#FF3B30" : "#007AFF",
                  }}
                >
                  {formatTime(timeLeft)}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p className="ios-caption">Correct</p>
                    <p
                      className="ios-body"
                      style={{ fontSize: "24px", fontWeight: "600" }}
                    >
                      {correctCount}
                    </p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p className="ios-caption">Mistakes</p>
                    <p
                      className="ios-body"
                      style={{ fontSize: "24px", fontWeight: "600" }}
                    >
                      {mistakes}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    className="ios-caption"
                    style={{ display: "block", marginBottom: "8px" }}
                  >
                    Question
                  </label>
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "16px",
                      background: "rgba(0, 122, 255, 0.1)",
                      borderRadius: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    {question}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label
                    className="ios-caption"
                    style={{ display: "block", marginBottom: "8px" }}
                  >
                    Your Answer
                  </label>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="ios-input"
                    placeholder="Enter answer"
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="ios-button"
                  style={{ width: "100%" }}
                >
                  Submit Answer
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
