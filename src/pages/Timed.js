import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateUserStats, addWrongAnswer } from "../services/database";
import LockedPage from "../components/LockedPage";

export default function Timed() {
  const { user } = useAuth();
  const [time, setTime] = useState(60);
  const [difficulty, setDifficulty] = useState("easy");
  const [operation, setOperation] = useState("random");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(time);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const endChallenge = useCallback(() => {
    setIsActive(false);
    setShowResults(true);
  }, []);

  const generateQuestionWithOperation = useCallback(
    (op) => {
      let num1, num2, operationSymbol, result;

      let maxNum, minNum;

      switch (difficulty) {
        case "easy":
          maxNum = op === "multiplication" ? 10 : 50;
          minNum = 1;
          break;
        case "medium":
          maxNum = op === "multiplication" ? 15 : 100;
          minNum = 1;
          break;
        case "hard":
          maxNum = op === "multiplication" ? 20 : 200;
          minNum = 1;
          break;
        default:
          maxNum = op === "multiplication" ? 10 : 50;
          minNum = 1;
      }

      switch (op) {
        case "addition":
          num1 = Math.floor(Math.random() * maxNum) + minNum;
          num2 = Math.floor(Math.random() * maxNum) + minNum;
          operationSymbol = "+";
          result = num1 + num2;
          break;
        case "subtraction":
          num1 = Math.floor(Math.random() * maxNum) + minNum;
          num2 = Math.floor(Math.random() * num1) + minNum;
          operationSymbol = "-";
          result = num1 - num2;
          break;
        case "multiplication":
          num1 = Math.floor(Math.random() * maxNum) + 1;
          num2 = Math.floor(Math.random() * maxNum) + 1;
          operationSymbol = "×";
          result = num1 * num2;
          break;
        case "division":
          num2 = Math.floor(Math.random() * maxNum) + 1;
          result = Math.floor(Math.random() * maxNum) + 1;
          num1 = num2 * result;
          operationSymbol = "÷";
          break;
        default:
          num1 = Math.floor(Math.random() * maxNum) + minNum;
          num2 = Math.floor(Math.random() * maxNum) + minNum;
          operationSymbol = "+";
          result = num1 + num2;
      }

      setQuestion(`${num1} ${operationSymbol} ${num2}`);
      setAnswer(result.toString());
      setUserAnswer("");
      setResult(null);
    },
    [difficulty]
  );

  const generateQuestion = useCallback(() => {
    let num1, num2, operationSymbol, result;

    // Generate numbers based on difficulty and operation
    let maxNum, minNum;

    switch (difficulty) {
      case "easy":
        maxNum = operation === "multiplication" ? 10 : 50;
        minNum = 1;
        break;
      case "medium":
        maxNum = operation === "multiplication" ? 15 : 100;
        minNum = 1;
        break;
      case "hard":
        maxNum = operation === "multiplication" ? 20 : 200;
        minNum = 1;
        break;
      default:
        maxNum = operation === "multiplication" ? 10 : 50;
        minNum = 1;
    }

    switch (operation) {
      case "addition":
        num1 = Math.floor(Math.random() * maxNum) + minNum;
        num2 = Math.floor(Math.random() * maxNum) + minNum;
        operationSymbol = "+";
        result = num1 + num2;
        break;
      case "subtraction":
        num1 = Math.floor(Math.random() * maxNum) + minNum;
        num2 = Math.floor(Math.random() * num1) + minNum;
        operationSymbol = "-";
        result = num1 - num2;
        break;
      case "multiplication":
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        operationSymbol = "×";
        result = num1 * num2;
        break;
      case "division":
        num2 = Math.floor(Math.random() * maxNum) + 1;
        result = Math.floor(Math.random() * maxNum) + 1;
        num1 = num2 * result;
        operationSymbol = "÷";
        break;
      case "random":
        const operations = [
          "addition",
          "subtraction",
          "multiplication",
          "division",
        ];
        const randomOp =
          operations[Math.floor(Math.random() * operations.length)];
        return generateQuestionWithOperation(randomOp);
      default:
        num1 = Math.floor(Math.random() * maxNum) + minNum;
        num2 = Math.floor(Math.random() * maxNum) + minNum;
        operationSymbol = "+";
        result = num1 + num2;
    }

    setQuestion(`${num1} ${operationSymbol} ${num2}`);
    setAnswer(result.toString());
    setUserAnswer("");
    setResult(null);
  }, [difficulty, operation, generateQuestionWithOperation]);

  const checkAnswer = useCallback(
    async (e) => {
      e.preventDefault();
      if (!userAnswer.trim()) return;

      const isCorrect = parseFloat(userAnswer) === parseFloat(answer);
      setTotalCount(totalCount + 1);

      if (isCorrect) {
        setCorrectCount(correctCount + 1);
      }

      // Save progress to database
      try {
        // Update user stats
        await updateUserStats(user.uid, isCorrect);

        // Save wrong answer if incorrect
        if (!isCorrect) {
          await addWrongAnswer(
            user.uid,
            `${question} = ${answer} (Your answer: ${userAnswer})`
          );
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      }

      // Generate next question immediately
      generateQuestion();
    },
    [
      userAnswer,
      answer,
      totalCount,
      correctCount,
      user,
      question,
      generateQuestion,
    ]
  );

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endChallenge();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, endChallenge]);

  // Auto-submit when user types an answer
  useEffect(() => {
    if (isActive && userAnswer.trim() && !result) {
      const isCorrect = parseFloat(userAnswer) === parseFloat(answer);

      if (isCorrect) {
        // Immediately accept correct answers
        checkAnswer({ preventDefault: () => {} });
      } else {
        // Wait 1.5 seconds for incorrect answers
        const timer = setTimeout(() => {
          checkAnswer({ preventDefault: () => {} });
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [userAnswer, isActive, result, answer, checkAnswer]);

  // Authentication gate
  if (!user) {
    return (
      <LockedPage
        title="Timed Challenge"
        description="Test your speed and accuracy with timed math challenges. Sign in to unlock this feature."
        icon="⏱️"
      />
    );
  }

  const startChallenge = () => {
    setIsActive(true);
    setIsKeyboardOpen(true); // Activate compact mode
    setTimeLeft(time);
    setCorrectCount(0);
    setTotalCount(0);
    setShowResults(false);
    generateQuestion();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const accuracy =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  if (showResults) {
    return (
      <div className="ios-container ios-fade-in">
        <h1 className="ios-title">Timed Challenge</h1>
        <p className="ios-subtitle"></p>

        <div className="ios-section">
          <div className="ios-card">
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
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
                  <p className="ios-caption">Accuracy</p>
                  <p
                    className="ios-body"
                    style={{ fontSize: "24px", fontWeight: "600" }}
                  >
                    {accuracy}%
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p className="ios-caption">Total</p>
                  <p
                    className="ios-body"
                    style={{ fontSize: "24px", fontWeight: "600" }}
                  >
                    {totalCount}
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p className="ios-caption">Time</p>
                  <p
                    className="ios-body"
                    style={{ fontSize: "24px", fontWeight: "600" }}
                  >
                    {formatTime(time - timeLeft)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowResults(false);
                  setIsKeyboardOpen(false); // Deactivate compact mode
                }}
                className="ios-button secondary"
                style={{ flex: 1 }}
              >
                Settings
              </button>
              <button
                onClick={startChallenge}
                className="ios-button"
                style={{ flex: 1 }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div
        className="ios-container ios-fade-in"
        style={{
          paddingTop: isKeyboardOpen ? "10px" : "20px",
          paddingBottom: isKeyboardOpen
            ? "10px"
            : "calc(env(safe-area-inset-bottom, 0px) + 83px)",
          minHeight: isKeyboardOpen ? "auto" : "100vh",
          justifyContent: isKeyboardOpen ? "flex-start" : "flex-start",
        }}
      >
        {!isKeyboardOpen ? (
          // Normal layout when keyboard is closed
          <>
            <h1 className="ios-title">Timed Challenge</h1>
            <p className="ios-subtitle"></p>

            <div className="ios-section">
              <div className="ios-card">
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div
                    style={{
                      fontSize: "48px",
                      fontWeight: "700",
                      color: timeLeft > 10 ? "#00ffff" : "#ff4757",
                      marginBottom: "16px",
                    }}
                  >
                    {formatTime(timeLeft)}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
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
                      <p className="ios-caption">Accuracy</p>
                      <p
                        className="ios-body"
                        style={{ fontSize: "24px", fontWeight: "600" }}
                      >
                        {accuracy}%
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={checkAnswer}>
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
                        background: "rgba(0, 255, 255, 0.1)",
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
                      step="any"
                      inputMode="numeric"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="ios-input"
                      placeholder="Enter answer"
                      required
                      autoFocus
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="button"
                      onClick={endChallenge}
                      className="ios-button secondary"
                      style={{ flex: 1 }}
                    >
                      Stop
                    </button>
                    <button
                      type="submit"
                      className="ios-button"
                      style={{ flex: 1 }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          // Compact layout when keyboard is open
          <div
            style={{
              width: "100%",
              padding: "0 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              height: "100vh",
              paddingTop: "20px",
            }}
          >
            <div className="ios-card">
              <form onSubmit={checkAnswer}>
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
                      background: "rgba(0, 255, 255, 0.1)",
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
                    step="any"
                    inputMode="numeric"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="ios-input"
                    placeholder="Enter answer"
                    required
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={endChallenge}
                    className="ios-button secondary"
                    style={{ flex: 1 }}
                  >
                    Stop
                  </button>
                  <button
                    type="submit"
                    className="ios-button"
                    style={{ flex: 1 }}
                  >
                    Submit
                  </button>
                </div>
              </form>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "700",
                  marginTop: "20px",
                  textAlign: "center",
                  color: timeLeft > 10 ? "#00ffff" : "#ff4757",
                }}
              >
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ios-container ios-fade-in">
      <h1 className="ios-title">Timed Challenge</h1>
      <p className="ios-subtitle">Test your speed and accuracy</p>

      <div className="ios-section">
        <div className="ios-card">
          <h3 className="ios-heading" style={{ marginBottom: "16px" }}>
            Challenge Settings
          </h3>

          <div style={{ marginBottom: "16px" }}>
            <label
              className="ios-caption"
              style={{ display: "block", marginBottom: "8px" }}
            >
              Time Limit
            </label>
            <select
              value={time}
              onChange={(e) => setTime(parseInt(e.target.value))}
              className="ios-select"
              style={{ width: "100%" }}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>

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
              style={{ width: "100%" }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              className="ios-caption"
              style={{ display: "block", marginBottom: "8px" }}
            >
              Operation Mode
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="ios-select"
              style={{ width: "100%" }}
            >
              <option value="random">Random</option>
              <option value="addition">Addition</option>
              <option value="subtraction">Subtraction</option>
              <option value="multiplication">Multiplication</option>
              <option value="division">Division</option>
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
    </div>
  );
}
