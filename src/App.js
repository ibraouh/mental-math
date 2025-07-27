import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ColorSchemeProvider } from "./contexts/ColorSchemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

// Lazy load page components for better performance
const Practice = lazy(() => import("./pages/Practice"));
const Timed = lazy(() => import("./pages/Timed"));
const Drills = lazy(() => import("./pages/Drills"));
const AITrain = lazy(() => import("./pages/AITrain"));
const Profile = lazy(() => import("./pages/Profile"));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="ios-container ios-fade-in">
    <div className="ios-card" style={{ textAlign: "center", padding: "40px" }}>
      <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
      <p className="ios-body">Loading...</p>
    </div>
  </div>
);

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
      <ColorSchemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Practice />} />
                  <Route path="/timed" element={<Timed />} />
                  <Route path="/drills" element={<Drills />} />
                  <Route path="/ai-train" element={<AITrain />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Suspense>
              <TabBar />
            </div>
          </Router>
        </AuthProvider>
      </ColorSchemeProvider>
    </ErrorBoundary>
  );
}

export default App;
