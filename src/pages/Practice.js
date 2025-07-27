import React, { useState, useCallback, useEffect } from "react";
import { IoAdd, IoRemove, IoClose, IoRemoveOutline } from "react-icons/io5";
import { generateQuestionWithOperation } from "../utils/questionGenerator";

export default function Practice() {
  const [leftDigits, setLeftDigits] = useState(2);
  const [rightDigits, setRightDigits] = useState(2);
  const [selectedOperations, setSelectedOperations] = useState(["addition"]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [practiceStarted, setPracticeStarted] = useState(false);

  // Keep input field focused to maintain keyboard activation
  useEffect(() => {
    if (practiceStarted && question) {
      const inputField = document.querySelector('input[type="number"]');
      if (inputField) {
        inputField.focus();
      }
    }
  }, [practiceStarted, question, result]);

  const generateQuestion = useCallback(() => {
    const availableOperations =
      selectedOperations.length > 0 ? selectedOperations : ["addition"];
    const randomOp =
      availableOperations[
        Math.floor(Math.random() * availableOperations.length)
      ];
    const { question: newQuestion, answer: newAnswer } =
      generateQuestionWithOperation(randomOp, leftDigits, rightDigits);

    setQuestion(newQuestion);
    setAnswer(newAnswer.toString());
    setUserAnswer("");
    setResult(null);
  }, [leftDigits, rightDigits, selectedOperations]);

  const handleNext = () => {
    generateQuestion();
  };

  const handleOperationChange = (operation) => {
    if (selectedOperations.includes(operation)) {
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
  };

  // Validate answer
  const handleSubmit = () => {
    if (userAnswer.trim() === "") return;
    if (userAnswer.trim() === answer) {
      setResult("correct");
      // Auto-advance immediately for correct answers
      generateQuestion();
    } else {
      setResult("incorrect");
    }
  };

  return (
    <div
      className="ios-container ios-fade-in"
      style={{
        paddingTop: "10px",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 83px)",
        minHeight: "auto",
        justifyContent: "flex-start",
      }}
    >
      {!practiceStarted ? (
        <>
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
                    gridTemplateColumns: "1fr 1fr 1fr",
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
        </>
      ) : (
        <div className="ios-section">
          <div className="ios-card">
            <div>
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
                  disabled={!question || result}
                  required
                  autoFocus
                />
              </div>

              {result === "incorrect" && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(255, 71, 87, 0.1)",
                    border: "1px solid rgba(255, 71, 87, 0.3)",
                    color: "#ff4757",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  ❌ Incorrect. The answer is {answer}
                </div>
              )}
              {result === "correct" && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(0, 255, 136, 0.1)",
                    border: "1px solid rgba(0, 255, 136, 0.3)",
                    color: "#00ff88",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  ✅ Correct!
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexDirection: "column",
                }}
              >
                <button
                  type="button"
                  onClick={result ? handleNext : handleSubmit}
                  className="ios-button"
                  style={{ width: "100%" }}
                  disabled={!userAnswer.trim()}
                >
                  {result ? "Next Question" : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={resetPractice}
                  className="ios-button secondary"
                  style={{
                    width: "100%",
                    fontSize: "15px",
                    padding: "8px 12px",
                  }}
                >
                  Exit Practice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
