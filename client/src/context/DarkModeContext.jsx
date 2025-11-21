import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem("darkMode") === "true";
  });

  // Update localStorage whenever darkMode changes
  useEffect(() => {
    // Persist in localStorage
    localStorage.setItem("darkMode", darkMode);

    // Apply attribute to <html>
    if (darkMode) {
      document.documentElement.setAttribute("data-darkmode", "true");
    } else {
      document.documentElement.removeAttribute("data-darkmode");
    }
  }, [darkMode]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "darkMode") {
        setDarkMode(e.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook for easy access
export const useDarkMode = () => useContext(DarkModeContext);
