import React, { useState, useEffect } from "react";
import { ThemeContext } from "./themeContextValue";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialIsDark = () => {
    const savedTheme = localStorage.getItem("hackerearth_theme");
    return savedTheme ? savedTheme === "dark" : true; // default dark
  };

  const [isDark, setIsDark] = useState<boolean>(getInitialIsDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("hackerearth_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
