import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LockedPage from "../components/LockedPage";

const DRILLS = [
  {
    id: "addition",
    name: "Addition",
    icon: "➕",
    description: "Practice adding numbers",
  },
  {
    id: "subtraction",
    name: "Subtraction",
    icon: "➖",
    description: "Practice subtracting numbers",
  },
  {
    id: "multiplication",
    name: "Multiplication",
    icon: "✖️",
    description: "Practice multiplying numbers",
  },
  {
    id: "division",
    name: "Division",
    icon: "➗",
    description: "Practice dividing numbers",
  },
  {
    id: "mixed",
    name: "Mixed Operations",
    icon: "🎯",
    description: "Practice all operations",
  },
  {
    id: "decimals",
    name: "Decimals",
    icon: "🔢",
    description: "Practice decimal arithmetic",
  },
  {
    id: "fractions",
    name: "Fractions",
    icon: "🍕",
    description: "Practice fraction operations",
  },
  {
    id: "percentages",
    name: "Percentages",
    icon: "💯",
    description: "Practice percentage calculations",
  },
];

export default function Learn() {
  const { user } = useAuth();
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // If user is not authenticated, show locked page
  if (!user) {
    return (
      <LockedPage
        title="Math Drills"
        description="Master specific math skills with targeted practice drills. Sign in to unlock this feature and track your progress."
      />
    );
  }

  const generateDrillQuestion = (drillType) => {
    let num1, num2, operation, result;

    switch (drillType) {
      case "addition":
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        operation = "+";
        result = num1 + num2;
        break;
      case "subtraction":
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        operation = "-";
        result = num1 - num2;
        break;
      case "multiplication":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        operation = "×";
        result = num1 * num2;
        break;
      case "division":
        num2 = Math.floor(Math.random() * 12) + 1;
        result = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * result;
        operation = "÷";
        break;
      case "mixed":
        const operations = ["+", "-", "×", "÷"];
        operation = operations[Math.floor(Math.random() * operations.length)];
        if (operation === "+") {
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * 50) + 1;
          result = num1 + num2;
        } else if (operation === "-") {
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * num1) + 1;
          result = num1 - num2;
        } else if (operation === "×") {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          result = num1 * num2;
        } else {
          num2 = Math.floor(Math.random() * 12) + 1;
          result = Math.floor(Math.random() * 12) + 1;
          num1 = num2 * result;
        }
        break;
      case "decimals":
        num1 = Math.floor(Math.random() * 100) / 10;
        num2 = Math.floor(Math.random() * 100) / 10;
        operation = "+";
        result = Math.round((num1 + num2) * 10) / 10;
        break;
      case "fractions":
        const den1 = Math.floor(Math.random() * 10) + 1;
        const num1 = Math.floor(Math.random() * den1) + 1;
        const den2 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * den2) + 1;
        operation = "+";
        result = Math.round((num1 / den1 + num2 / den2) * 100) / 100;
        setQuestion(`${num1}/${den1} + ${num2}/${den2}`);
        setAnswer(result.toString());
        setUserAnswer("");
        return;
      case "percentages":
        const base = Math.floor(Math.random() * 100) + 1;
        const percentage = Math.floor(Math.random() * 100) + 1;
        operation = "%";
        result = Math.round((base * percentage) / 100);
        setQuestion(`${percentage}% of ${base}`);
        setAnswer(result.toString());
        setUserAnswer("");
        return;
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

  const startDrill = (drillType) => {
    setSelectedDrill(drillType);
    setScore(0);
    setTotal(0);
    setShowResult(false);
    generateDrillQuestion(drillType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTotal(total + 1);

    if (parseFloat(userAnswer) === parseFloat(answer)) {
      setScore(score + 1);
    }

    generateDrillQuestion(selectedDrill);
  };

  const endDrill = () => {
    setShowResult(true);
  };

  const backToDrills = () => {
    setSelectedDrill(null);
    setShowResult(false);
  };

  if (showResult) {
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className="ios-container ios-fade-in">
        <h1 className="ios-title">Drill Complete!</h1>

        <div className="ios-section">
          <div className="ios-card">
            <div style={{ textAlign: "center" }}>
              <h2 className="ios-heading" style={{ marginBottom: "24px" }}>
                {accuracy >= 80
                  ? "Excellent! 🎉"
                  : accuracy >= 60
                  ? "Good Job! 👍"
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
                    {score}
                  </p>
                  <p className="ios-caption">Correct</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                    📊
                  </div>
                  <p
                    className="ios-body"
                    style={{ fontSize: "24px", fontWeight: "600" }}
                  >
                    {accuracy}%
                  </p>
                  <p className="ios-caption">Accuracy</p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => startDrill(selectedDrill)}
                  className="ios-button"
                >
                  Try Again
                </button>
                <button onClick={backToDrills} className="ios-button secondary">
                  Back to Drills
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedDrill) {
    return (
      <div className="ios-container ios-fade-in">
        <h1 className="ios-title">
          {DRILLS.find((d) => d.id === selectedDrill)?.name}
        </h1>

        <div className="ios-section">
          <div className="ios-card">
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <p className="ios-caption">Score</p>
                  <p
                    className="ios-body"
                    style={{ fontSize: "24px", fontWeight: "600" }}
                  >
                    {score}
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p className="ios-caption">Total</p>
                  <p
                    className="ios-body"
                    style={{ fontSize: "24px", fontWeight: "600" }}
                  >
                    {total}
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
                  step="any"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="ios-input"
                  placeholder="Enter answer"
                  autoFocus
                  required
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <button type="submit" className="ios-button">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={endDrill}
                  className="ios-button secondary"
                >
                  End Drill
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ios-container ios-fade-in">
      <h1 className="ios-title">Math Drills</h1>
      <p className="ios-subtitle">
        Master specific skills with targeted practice
      </p>

      <div className="ios-section">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            height: "calc(100vh - 300px)",
            maxHeight: "410px",
          }}
        >
          {DRILLS.map((drill) => (
            <div
              key={drill.id}
              className="ios-card"
              style={{
                marginBottom: 0,
                cursor: "pointer",
                padding: "16px",
                transition: "transform 0.2s ease, background-color 0.2s ease",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => startDrill(drill.id)}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.02)";
                e.target.style.backgroundColor = "rgba(0, 122, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.backgroundColor = "";
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                  {drill.icon}
                </div>
                <h4
                  className="ios-heading"
                  style={{ marginBottom: "4px", fontSize: "16px" }}
                >
                  {drill.name}
                </h4>
                <p
                  className="ios-caption"
                  style={{ fontSize: "12px", lineHeight: "1.3" }}
                >
                  {drill.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
