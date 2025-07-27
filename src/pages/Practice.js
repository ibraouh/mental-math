import React, { useState, useEffect, useCallback } from "react";
import { IoAdd, IoRemove, IoClose, IoRemoveOutline } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import { updateUserStats, addWrongAnswer } from "../services/database";

export default function Practice() {
  const { user } = useAuth();
  const [leftDigits, setLeftDigits] = useState(2);
  const [rightDigits, setRightDigits] = useState(2);
  const [selectedOperations, setSelectedOperations] = useState(["addition"]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const generateQuestion = useCallback(() => {
    let num1, num2, operation, result;

    // Generate numbers based on digit settings
    const maxLeft = Math.pow(10, leftDigits) - 1;
    const minLeft = Math.pow(10, leftDigits - 1);
    const maxRight = Math.pow(10, rightDigits) - 1;
    const minRight = Math.pow(10, rightDigits - 1);

    // Select random operation from selected operations
    const availableOperations =
      selectedOperations.length > 0 ? selectedOperations : ["addition"];
    const randomOp =
      availableOperations[
        Math.floor(Math.random() * availableOperations.length)
      ];

    switch (randomOp) {
      case "addition":
        num1 = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
        num2 = Math.floor(Math.random() * (maxRight - minRight + 1)) + minRight;
        operation = "+";
        result = num1 + num2;
        break;
      case "subtraction":
        num1 = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
        num2 =
          Math.floor(Math.random() * Math.min(num1, maxRight - minRight + 1)) +
          minRight;
        operation = "-";
        result = num1 - num2;
        break;
      case "multiplication":
        num1 = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
        num2 = Math.floor(Math.random() * (maxRight - minRight + 1)) + minRight;
        operation = "×";
        result = num1 * num2;
        break;
      case "division":
        num2 = Math.floor(Math.random() * (maxRight - minRight + 1)) + minRight;
        result = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
        num1 = num2 * result;
        operation = "÷";
        break;
      default:
        num1 = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
        num2 = Math.floor(Math.random() * (maxRight - minRight + 1)) + minRight;
        operation = "+";
        result = num1 + num2;
    }

    setQuestion(`${num1} ${operation} ${num2}`);
    setAnswer(result.toString());
    setUserAnswer("");
    setResult(null);
  }, [leftDigits, rightDigits, selectedOperations]);

  const checkAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const isCorrect = parseFloat(userAnswer) === parseFloat(answer);
    setResult(isCorrect ? "correct" : "incorrect");
    setTotalCount(totalCount + 1);

    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }

    // Save progress to database if user is logged in
    if (user) {
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
    }
  };

  // Auto-advance to next question when answer is correct
  useEffect(() => {
    if (result === "correct") {
      const timer = setTimeout(() => {
        generateQuestion();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [result, generateQuestion]);

  // Detect keyboard visibility
  useEffect(() => {
    const handleResize = () => {
      const isKeyboard = window.innerHeight < window.outerHeight * 0.8;
      setIsKeyboardOpen(isKeyboard);
    };

    const handleFocus = () => {
      // Small delay to let the keyboard open
      setTimeout(() => {
        const isKeyboard = window.innerHeight < window.outerHeight * 0.8;
        setIsKeyboardOpen(isKeyboard);
      }, 300);
    };

    const handleBlur = () => {
      setIsKeyboardOpen(false);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const handleOperationChange = (operation) => {
    if (selectedOperations.includes(operation)) {
      // Prevent removing the last operation
      if (selectedOperations.length > 1) {
        setSelectedOperations(
          selectedOperations.filter((op) => op !== operation)
        );
      }
    } else {
      setSelectedOperations([...selectedOperations, operation]);
    }
  };

  const startPractice = () => {
    setPracticeStarted(true);
    generateQuestion();
  };

  const resetPractice = () => {
    setPracticeStarted(false);
    setQuestion("");
    setAnswer("");
    setUserAnswer("");
    setResult(null);
    setCorrectCount(0);
    setTotalCount(0);
  };

  const accuracy =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  if (!practiceStarted) {
    return (
      <div className="ios-container ios-fade-in">
        <h1 className="ios-title">Practice</h1>
        <p className="ios-subtitle">Free practice mode - no time limits</p>

        <div className="ios-section">
          <div className="ios-card">
            <h3 className="ios-heading" style={{ marginBottom: "16px" }}>
              Customize Your Practice
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label
                className="ios-caption"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Number of Digits
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <select
                    value={leftDigits}
                    onChange={(e) => setLeftDigits(parseInt(e.target.value))}
                    className="ios-select"
                  >
                    <option value={1}>1 digit</option>
                    <option value={2}>2 digits</option>
                    <option value={3}>3 digits</option>
                    <option value={4}>4 digits</option>
                  </select>
                </div>
                <div>
                  <select
                    value={rightDigits}
                    onChange={(e) => setRightDigits(parseInt(e.target.value))}
                    className="ios-select"
                  >
                    <option value={1}>1 digit</option>
                    <option value={2}>2 digits</option>
                    <option value={3}>3 digits</option>
                    <option value={4}>4 digits</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                className="ios-caption"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Operations
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { id: "addition", icon: <IoAdd size={25} /> },
                  { id: "subtraction", icon: <IoRemove size={25} /> },
                  { id: "multiplication", icon: <IoClose size={25} /> },
                  { id: "division", icon: <IoRemoveOutline size={25} /> },
                ].map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => handleOperationChange(op.id)}
                    className={`ios-button ${
                      selectedOperations.includes(op.id) ? "" : "secondary"
                    }`}
                    style={{
                      padding: "12px",
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    {op.icon}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startPractice}
              className="ios-button"
              style={{ width: "100%" }}
            >
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      {!isKeyboardOpen && (
        <>
          <h1 className="ios-title">Practice</h1>
          <p className="ios-subtitle">Free practice mode - no time limits</p>
        </>
      )}

      <div className="ios-section">
        <div className="ios-card">
          {!isKeyboardOpen && (
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
              </div>
            </div>
          )}

          <form onSubmit={checkAnswer}>
            <div style={{ marginBottom: isKeyboardOpen ? "12px" : "16px" }}>
              <label
                className="ios-caption"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Question
              </label>
              <div
                style={{
                  fontSize: isKeyboardOpen ? "24px" : "32px",
                  fontWeight: "600",
                  textAlign: "center",
                  padding: isKeyboardOpen ? "12px" : "16px",
                  background: "rgba(0, 255, 255, 0.1)",
                  borderRadius: "12px",
                  marginBottom: isKeyboardOpen ? "12px" : "16px",
                }}
              >
                {question || 'Click "New Question" to start'}
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
                disabled={!question}
                required
              />
            </div>

            {result === "incorrect" && (
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
                ❌ Incorrect. The answer is {answer}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type={
                  result ? "button" : userAnswer.trim() ? "submit" : "button"
                }
                onClick={
                  result
                    ? generateQuestion
                    : userAnswer.trim()
                    ? undefined
                    : generateQuestion
                }
                className="ios-button"
                style={{ width: "100%" }}
              >
                {result
                  ? "Next Question"
                  : userAnswer.trim()
                  ? "Check Answer"
                  : "Skip"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="ios-section">
        <button
          onClick={resetPractice}
          className="ios-button secondary"
          style={{ width: "100%" }}
        >
          Back to Settings
        </button>
      </div>
    </div>
  );
}
