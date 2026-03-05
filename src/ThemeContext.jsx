import React, { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const USE_THEME_ERROR_MESSAGE = "useTheme must be used within a ThemeProvider";

const defaultStorageAdapter = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
};

function applyThemeToDOM(theme) {
  // Remove all theme classes starting with 'theme-'
  document.body.className = document.body.className
    .split(" ")
    .filter((c) => !c.startsWith("theme-"))
    .join(" ");

  // Add current theme class
  document.body.classList.add(`theme-${theme}`);
}

export function ThemeProvider({ children, storageAdapter = defaultStorageAdapter }) {
  const [theme, setTheme] = useState(() => storageAdapter.getItem("theme") || "light");

  useEffect(() => {
    applyThemeToDOM(theme);
    storageAdapter.setItem("theme", theme);
  }, [theme, storageAdapter]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error(USE_THEME_ERROR_MESSAGE);
  return context;
}

export function isThemeContextAvailable() {
  return useContext(ThemeContext) !== null;
}