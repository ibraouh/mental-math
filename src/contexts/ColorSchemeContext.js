import React, { createContext, useContext, useState, useEffect } from "react";
import { setColorSchemeContext } from "./AuthContext";

const ColorSchemeContext = createContext();

export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");
  }
  return context;
};

export const ColorSchemeProvider = ({ children }) => {
  const [currentScheme, setCurrentScheme] = useState("cyan");

  // Available color schemes
  const colorSchemes = {
    cyan: {
      name: "Cyan Dark",
      description: "Classic cyan accent with dark blue background",
      preview: "linear-gradient(135deg, #00ffff, #0080ff)",
    },
    purple: {
      name: "Purple Dark",
      description: "Elegant purple accent with dark purple background",
      preview: "linear-gradient(135deg, #a855f7, #7c3aed)",
    },
    green: {
      name: "Green Dark",
      description: "Fresh green accent with dark green background",
      preview: "linear-gradient(135deg, #10b981, #059669)",
    },
    orange: {
      name: "Orange Dark",
      description: "Warm orange accent with dark red background",
      preview: "linear-gradient(135deg, #f97316, #ea580c)",
    },
    blue: {
      name: "Blue Dark",
      description: "Deep blue accent with navy background",
      preview: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    },
    pink: {
      name: "Pink Dark",
      description: "Soft pink accent with dark magenta background",
      preview: "linear-gradient(135deg, #ec4899, #be185d)",
    },
    neon: {
      name: "Neon Dark",
      description: "Subtle neon accents on dark background",
      preview: "linear-gradient(135deg, #00d4ff, #0099cc)",
    },
    sunset: {
      name: "Sunset Dark",
      description: "Warm sunset colors on dark background",
      preview: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
  };

  // Apply color scheme to CSS custom properties
  const applyColorScheme = (scheme) => {
    const root = document.documentElement;

    switch (scheme) {
      case "cyan":
        root.style.setProperty(
          "--primary-bg",
          "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)"
        );
        root.style.setProperty("--primary-accent", "#00ffff");
        root.style.setProperty("--primary-accent-hover", "#00e6e6");
        root.style.setProperty("--primary-accent-active", "#00cccc");
        root.style.setProperty("--secondary-bg", "rgba(15, 15, 35, 0.95)");
        root.style.setProperty("--secondary-accent", "rgba(0, 255, 255, 0.1)");
        root.style.setProperty(
          "--secondary-accent-border",
          "rgba(0, 255, 255, 0.3)"
        );
        root.style.setProperty("--success-color", "#00ff88");
        root.style.setProperty("--error-color", "#ff4757");
        root.style.setProperty("--warning-color", "#ffa726");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--text-muted", "#8e8e93");
        root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.1)");
        root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--input-border", "rgba(255, 255, 255, 0.2)");
        root.style.setProperty("--input-focus-border", "#00ffff");
        root.style.setProperty("--tab-bg", "rgba(15, 15, 35, 0.95)");
        root.style.setProperty("--tab-border", "rgba(0, 255, 255, 0.3)");
        root.style.setProperty("--tab-inactive", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--tab-active", "#00ffff");
        root.style.setProperty("--btn-secondary-bg", "rgba(0, 255, 255, 0.1)");
        root.style.setProperty(
          "--btn-secondary-border",
          "rgba(0, 255, 255, 0.3)"
        );
        root.style.setProperty("--btn-secondary-text", "#00ffff");
        root.style.setProperty(
          "--btn-primary-bg",
          "linear-gradient(135deg, #00ffff, #0080ff)"
        );
        root.style.setProperty(
          "--btn-primary-hover",
          "linear-gradient(135deg, #00e6e6, #0066cc)"
        );
        root.style.setProperty(
          "--btn-primary-active",
          "linear-gradient(135deg, #00cccc, #004d99)"
        );
        break;

      case "purple":
        root.style.setProperty(
          "--primary-bg",
          "linear-gradient(135deg, #1a0b2e 0%, #2d1b69 50%, #16213e 100%)"
        );
        root.style.setProperty("--primary-accent", "#a855f7");
        root.style.setProperty("--primary-accent-hover", "#9333ea");
        root.style.setProperty("--primary-accent-active", "#7c3aed");
        root.style.setProperty("--secondary-bg", "rgba(26, 11, 46, 0.95)");
        root.style.setProperty("--secondary-accent", "rgba(168, 85, 247, 0.1)");
        root.style.setProperty(
          "--secondary-accent-border",
          "rgba(168, 85, 247, 0.3)"
        );
        root.style.setProperty("--success-color", "#10b981");
        root.style.setProperty("--error-color", "#ef4444");
        root.style.setProperty("--warning-color", "#f59e0b");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--text-muted", "#8e8e93");
        root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.1)");
        root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--input-border", "rgba(255, 255, 255, 0.2)");
        root.style.setProperty("--input-focus-border", "#a855f7");
        root.style.setProperty("--tab-bg", "rgba(26, 11, 46, 0.95)");
        root.style.setProperty("--tab-border", "rgba(168, 85, 247, 0.3)");
        root.style.setProperty("--tab-inactive", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--tab-active", "#a855f7");
        root.style.setProperty("--btn-secondary-bg", "rgba(168, 85, 247, 0.1)");
        root.style.setProperty(
          "--btn-secondary-border",
          "rgba(168, 85, 247, 0.3)"
        );
        root.style.setProperty("--btn-secondary-text", "#a855f7");
        root.style.setProperty(
          "--btn-primary-bg",
          "linear-gradient(135deg, #a855f7, #7c3aed)"
        );
        root.style.setProperty(
          "--btn-primary-hover",
          "linear-gradient(135deg, #9333ea, #6d28d9)"
        );
        root.style.setProperty(
          "--btn-primary-active",
          "linear-gradient(135deg, #7c3aed, #5b21b6)"
        );
        break;

      case "green":
        root.style.setProperty(
          "--primary-bg",
          "linear-gradient(135deg, #0f1f0f 0%, #1a2e1a 50%, #162e16 100%)"
        );
        root.style.setProperty("--primary-accent", "#10b981");
        root.style.setProperty("--primary-accent-hover", "#059669");
        root.style.setProperty("--primary-accent-active", "#047857");
        root.style.setProperty("--secondary-bg", "rgba(15, 31, 15, 0.95)");
        root.style.setProperty("--secondary-accent", "rgba(16, 185, 129, 0.1)");
        root.style.setProperty(
          "--secondary-accent-border",
          "rgba(16, 185, 129, 0.3)"
        );
        root.style.setProperty("--success-color", "#22c55e");
        root.style.setProperty("--error-color", "#ef4444");
        root.style.setProperty("--warning-color", "#f59e0b");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--text-muted", "#8e8e93");
        root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.1)");
        root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--input-border", "rgba(255, 255, 255, 0.2)");
        root.style.setProperty("--input-focus-border", "#10b981");
        root.style.setProperty("--tab-bg", "rgba(15, 31, 15, 0.95)");
        root.style.setProperty("--tab-border", "rgba(16, 185, 129, 0.3)");
        root.style.setProperty("--tab-inactive", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--tab-active", "#10b981");
        root.style.setProperty("--btn-secondary-bg", "rgba(16, 185, 129, 0.1)");
        root.style.setProperty(
          "--btn-secondary-border",
          "rgba(16, 185, 129, 0.3)"
        );
        root.style.setProperty("--btn-secondary-text", "#10b981");
        root.style.setProperty(
          "--btn-primary-bg",
          "linear-gradient(135deg, #10b981, #059669)"
        );
        root.style.setProperty(
          "--btn-primary-hover",
          "linear-gradient(135deg, #059669, #047857)"
        );
        root.style.setProperty(
          "--btn-primary-active",
          "linear-gradient(135deg, #047857, #065f46)"
        );
        break;

      case "orange":
        root.style.setProperty(
          "--primary-bg",
          "linear-gradient(135deg, #1f0f0f 0%, #2e1a1a 50%, #2e1616 100%)"
        );
        root.style.setProperty("--primary-accent", "#f97316");
        root.style.setProperty("--primary-accent-hover", "#ea580c");
        root.style.setProperty("--primary-accent-active", "#dc2626");
        root.style.setProperty("--secondary-bg", "rgba(31, 15, 15, 0.95)");
        root.style.setProperty("--secondary-accent", "rgba(249, 115, 22, 0.1)");
        root.style.setProperty(
          "--secondary-accent-border",
          "rgba(249, 115, 22, 0.3)"
        );
        root.style.setProperty("--success-color", "#22c55e");
        root.style.setProperty("--error-color", "#ef4444");
        root.style.setProperty("--warning-color", "#f59e0b");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--text-muted", "#8e8e93");
        root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.1)");
        root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--input-border", "rgba(255, 255, 255, 0.2)");
        root.style.setProperty("--input-focus-border", "#f97316");
        root.style.setProperty("--tab-bg", "rgba(31, 15, 15, 0.95)");
        root.style.setProperty("--tab-border", "rgba(249, 115, 22, 0.3)");
        root.style.setProperty("--tab-inactive", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--tab-active", "#f97316");
        root.style.setProperty("--btn-secondary-bg", "rgba(249, 115, 22, 0.1)");
        root.style.setProperty(
          "--btn-secondary-border",
          "rgba(249, 115, 22, 0.3)"
        );
        root.style.setProperty("--btn-secondary-text", "#f97316");
        root.style.setProperty(
          "--btn-primary-bg",
          "linear-gradient(135deg, #f97316, #ea580c)"
        );
        root.style.setProperty(
          "--btn-primary-hover",
          "linear-gradient(135deg, #ea580c, #dc2626)"
        );
        root.style.setProperty(
          "--btn-primary-active",
          "linear-gradient(135deg, #dc2626, #b91c1c)"
        );
        break;

      case "blue":
        root.style.setProperty(
          "--primary-bg",
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
        );
        root.style.setProperty("--primary-accent", "#3b82f6");
        root.style.setProperty("--primary-accent-hover", "#2563eb");
        root.style.setProperty("--primary-accent-active", "#1d4ed8");
        root.style.setProperty("--secondary-bg", "rgba(15, 23, 42, 0.95)");
        root.style.setProperty("--secondary-accent", "rgba(59, 130, 246, 0.1)");
        root.style.setProperty(
          "--secondary-accent-border",
          "rgba(59, 130, 246, 0.3)"
        );
        root.style.setProperty("--success-color", "#10b981");
        root.style.setProperty("--error-color", "#ef4444");
        root.style.setProperty("--warning-color", "#f59e0b");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--text-muted", "#8e8e93");
        root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.1)");
        root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--input-border", "rgba(255, 255, 255, 0.2)");
        root.style.setProperty("--input-focus-border", "#3b82f6");
        root.style.setProperty("--tab-bg", "rgba(15, 23, 42, 0.95)");
        root.style.setProperty("--tab-border", "rgba(59, 130, 246, 0.3)");
        root.style.setProperty("--tab-inactive", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--tab-active", "#3b82f6");
        root.style.setProperty("--btn-secondary-bg", "rgba(59, 130, 246, 0.1)");
        root.style.setProperty(
          "--btn-secondary-border",
          "rgba(59, 130, 246, 0.3)"
        );
        root.style.setProperty("--btn-secondary-text", "#3b82f6");
        root.style.setProperty(
          "--btn-primary-bg",
          "linear-gradient(135deg, #3b82f6, #1d4ed8)"
        );
        root.style.setProperty(
          "--btn-primary-hover",
          "linear-gradient(135deg, #2563eb, #1e40af)"
        );
        root.style.setProperty(
          "--btn-primary-active",
          "linear-gradient(135deg, #1d4ed8, #1e3a8a)"
        );
        break;

      case "pink":
        root.style.setProperty(
          "--primary-bg",
          "linear-gradient(135deg, #1f0f1f 0%, #2e1a2e 50%, #2e162e 100%)"
        );
        root.style.setProperty("--primary-accent", "#ec4899");
        root.style.setProperty("--primary-accent-hover", "#db2777");
        root.style.setProperty("--primary-accent-active", "#be185d");
        root.style.setProperty("--secondary-bg", "rgba(31, 15, 31, 0.95)");
        root.style.setProperty("--secondary-accent", "rgba(236, 72, 153, 0.1)");
        root.style.setProperty(
          "--secondary-accent-border",
          "rgba(236, 72, 153, 0.3)"
        );
        root.style.setProperty("--success-color", "#10b981");
        root.style.setProperty("--error-color", "#ef4444");
        root.style.setProperty("--warning-color", "#f59e0b");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--text-muted", "#8e8e93");
        root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.1)");
        root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--input-border", "rgba(255, 255, 255, 0.2)");
        root.style.setProperty("--input-focus-border", "#ec4899");
        root.style.setProperty("--tab-bg", "rgba(31, 15, 31, 0.95)");
        root.style.setProperty("--tab-border", "rgba(236, 72, 153, 0.3)");
        root.style.setProperty("--tab-inactive", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--tab-active", "#ec4899");
        root.style.setProperty("--btn-secondary-bg", "rgba(236, 72, 153, 0.1)");
        root.style.setProperty(
          "--btn-secondary-border",
          "rgba(236, 72, 153, 0.3)"
        );
        root.style.setProperty("--btn-secondary-text", "#ec4899");
        root.style.setProperty(
          "--btn-primary-bg",
          "linear-gradient(135deg, #ec4899, #be185d)"
        );
        root.style.setProperty(
          "--btn-primary-hover",
          "linear-gradient(135deg, #db2777, #a21caf)"
        );
        root.style.setProperty(
          "--btn-primary-active",
          "linear-gradient(135deg, #be185d, #831843)"
        );
        break;

      case "neon":
        root.style.setProperty(
          "--primary-bg",
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)"
        );
        root.style.setProperty("--primary-accent", "#00d4ff");
        root.style.setProperty("--primary-accent-hover", "#00b8e6");
        root.style.setProperty("--primary-accent-active", "#0099cc");
        root.style.setProperty("--secondary-bg", "rgba(10, 10, 10, 0.95)");
        root.style.setProperty("--secondary-accent", "rgba(0, 212, 255, 0.1)");
        root.style.setProperty(
          "--secondary-accent-border",
          "rgba(0, 212, 255, 0.3)"
        );
        root.style.setProperty("--success-color", "#10b981");
        root.style.setProperty("--error-color", "#ef4444");
        root.style.setProperty("--warning-color", "#f59e0b");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--text-muted", "#8e8e93");
        root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.1)");
        root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--input-border", "rgba(255, 255, 255, 0.2)");
        root.style.setProperty("--input-focus-border", "#00d4ff");
        root.style.setProperty("--tab-bg", "rgba(10, 10, 10, 0.95)");
        root.style.setProperty("--tab-border", "rgba(0, 212, 255, 0.3)");
        root.style.setProperty("--tab-inactive", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--tab-active", "#00d4ff");
        root.style.setProperty("--btn-secondary-bg", "rgba(0, 212, 255, 0.1)");
        root.style.setProperty(
          "--btn-secondary-border",
          "rgba(0, 212, 255, 0.3)"
        );
        root.style.setProperty("--btn-secondary-text", "#00d4ff");
        root.style.setProperty(
          "--btn-primary-bg",
          "linear-gradient(135deg, #00d4ff, #0099cc)"
        );
        root.style.setProperty(
          "--btn-primary-hover",
          "linear-gradient(135deg, #00b8e6, #0077a3)"
        );
        root.style.setProperty(
          "--btn-primary-active",
          "linear-gradient(135deg, #0099cc, #005580)"
        );
        break;

      case "sunset":
        root.style.setProperty(
          "--primary-bg",
          "linear-gradient(135deg, #1f0f0f 0%, #2e1a1a 50%, #2e1616 100%)"
        );
        root.style.setProperty("--primary-accent", "#f59e0b");
        root.style.setProperty("--primary-accent-hover", "#d97706");
        root.style.setProperty("--primary-accent-active", "#b45309");
        root.style.setProperty("--secondary-bg", "rgba(31, 15, 15, 0.95)");
        root.style.setProperty("--secondary-accent", "rgba(245, 158, 11, 0.1)");
        root.style.setProperty(
          "--secondary-accent-border",
          "rgba(245, 158, 11, 0.3)"
        );
        root.style.setProperty("--success-color", "#10b981");
        root.style.setProperty("--error-color", "#ef4444");
        root.style.setProperty("--warning-color", "#f59e0b");
        root.style.setProperty("--text-primary", "#ffffff");
        root.style.setProperty("--text-secondary", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--text-muted", "#8e8e93");
        root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.1)");
        root.style.setProperty("--input-bg", "rgba(255, 255, 255, 0.05)");
        root.style.setProperty("--input-border", "rgba(255, 255, 255, 0.2)");
        root.style.setProperty("--input-focus-border", "#f59e0b");
        root.style.setProperty("--tab-bg", "rgba(31, 15, 15, 0.95)");
        root.style.setProperty("--tab-border", "rgba(245, 158, 11, 0.3)");
        root.style.setProperty("--tab-inactive", "rgba(255, 255, 255, 0.6)");
        root.style.setProperty("--tab-active", "#f59e0b");
        root.style.setProperty("--btn-secondary-bg", "rgba(245, 158, 11, 0.1)");
        root.style.setProperty(
          "--btn-secondary-border",
          "rgba(245, 158, 11, 0.3)"
        );
        root.style.setProperty("--btn-secondary-text", "#f59e0b");
        root.style.setProperty(
          "--btn-primary-bg",
          "linear-gradient(135deg, #f59e0b, #d97706)"
        );
        root.style.setProperty(
          "--btn-primary-hover",
          "linear-gradient(135deg, #d97706, #b45309)"
        );
        root.style.setProperty(
          "--btn-primary-active",
          "linear-gradient(135deg, #b45309, #92400e)"
        );
        break;

      default:
        // Default to cyan
        applyColorScheme("cyan");
        return;
    }
  };

  // Change color scheme
  const changeColorScheme = (scheme) => {
    setCurrentScheme(scheme);
    applyColorScheme(scheme);
    localStorage.setItem("colorScheme", scheme);
  };

  // Initialize color scheme on mount
  useEffect(() => {
    const savedScheme = localStorage.getItem("colorScheme") || "cyan";
    setCurrentScheme(savedScheme);
    applyColorScheme(savedScheme);
  }, []);

  const value = {
    currentScheme,
    colorSchemes,
    changeColorScheme,
  };

  // Provide context to AuthContext for integration
  useEffect(() => {
    setColorSchemeContext(value);
  }, [value]);

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
