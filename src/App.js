import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Practice from "./pages/Practice";
import Timed from "./pages/Timed";
import Learn from "./pages/Learn";
import AITrain from "./pages/AITrain";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Tab Bar Component
function TabBar() {
  const location = useLocation();

  const tabs = [
    { path: "/", label: "Practice", icon: "🧮" },
    { path: "/timed", label: "Timed", icon: "⏱️" },
    { path: "/drills", label: "Drills", icon: "🎯" },
    { path: "/ai-train", label: "AI Train", icon: "🤖" },
    { path: "/profile", label: "Profile", icon: "💁🏽" },
  ];

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <a
          key={tab.path}
          href={tab.path}
          className={location.pathname === tab.path ? "active" : ""}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Practice />} />
              <Route path="/timed" element={<Timed />} />
              <Route path="/drills" element={<Learn />} />
              <Route path="/ai-train" element={<AITrain />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <TabBar />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
