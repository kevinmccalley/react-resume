import React, { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const defaultStorageAdapter = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
};

export function ThemeProvider({ children, storageAdapter = defaultStorageAdapter }) {
  const [theme, setTheme] = useState(() => storageAdapter.getItem("theme") || "light");

  useEffect(() => {
    // Remove all theme classes starting with 'theme-'
    document.body.className = document.body.className
      .split(" ")
      .filter((c) => !c.startsWith("theme-"))
      .join(" ");

    // Add current theme class
    document.body.classList.add(`theme-${theme}`);

    storageAdapter.setItem("theme", theme);
  }, [theme, storageAdapter]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}