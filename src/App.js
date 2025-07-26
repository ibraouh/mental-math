import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Practice from "./pages/Practice";
import Timed from "./pages/Timed";
import Learn from "./pages/Learn";
import AITrain from "./pages/AITrain";
import Profile from "./pages/Profile";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { checkEnvironmentVariables } from "./utils/envCheck";

// Check environment variables on app start
if (process.env.NODE_ENV === "development") {
  checkEnvironmentVariables();
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function TabBar() {
  const location = useLocation();
  const tabs = [
    { to: "/", label: "Practice", icon: "🧮" },
    { to: "/timed", label: "Timed", icon: "⏱️" },
    { to: "/learn", label: "Drills", icon: "🎯" },
    { to: "/aitrain", label: "AI Train", icon: "🤖" },
    { to: "/profile", label: "Profile", icon: "💁🏽" },
  ];
  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={location.pathname === tab.to ? "active" : ""}
        >
          <span role="img" aria-label={tab.label}>
            {tab.icon}
          </span>
          <div>{tab.label}</div>
        </Link>
      ))}
    </nav>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Routes>
              <Route path="/" element={<Practice />} />
              <Route path="/timed" element={<Timed />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/aitrain" element={<AITrain />} />
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
