import React, { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Remove all theme classes starting with 'theme-'
    document.body.className = document.body.className
      .split(" ")
      .filter((c) => !c.startsWith("theme-"))
      .join(" ");

    // Add current theme class
    document.body.classList.add(`theme-${theme}`);

    localStorage.setItem("theme", theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
