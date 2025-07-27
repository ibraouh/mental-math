import { useState } from "react";

export const useKeyboardLayout = () => {
  const [isCompactMode, setIsCompactMode] = useState(false);

  const activateCompactMode = () => setIsCompactMode(true);
  const deactivateCompactMode = () => setIsCompactMode(false);

  const getContainerStyle = () => ({
    paddingTop: isCompactMode ? "10px" : "20px",
    paddingBottom: isCompactMode
      ? "10px"
      : "calc(env(safe-area-inset-bottom, 0px) + 83px)",
    minHeight: isCompactMode ? "auto" : "100vh",
    justifyContent: "flex-start",
  });

  return {
    isCompactMode,
    activateCompactMode,
    deactivateCompactMode,
    getContainerStyle,
  };
};
