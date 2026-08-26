import React, { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const STORAGE_KEY = "theme";

/* id must match the [data-theme="…"] blocks in ReactResume.css.
   swatch is the dot shown in the sidebar picker. */
export const THEMES = [
  { id: "light", label: "Light", swatch: "#e9e9e6" },
  { id: "dark", label: "Dark", swatch: "#1c1c20" },
  { id: "sea", label: "Sea", swatch: "#1f9aa8" },
  { id: "coral", label: "Coral", swatch: "#ef5f47" },
  { id: "sand", label: "Sand", swatch: "#c99a5b" },
  { id: "jungle", label: "Jungle", swatch: "#2fa866" },
  { id: "neon", label: "Neon", swatch: "#12e0f0" },
];

const THEME_IDS = THEMES.map((t) => t.id);
export const isThemeId = (v) => THEME_IDS.includes(v);

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isThemeId(stored)) return stored;
  } catch {
    /* localStorage unavailable */
  }
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  const setTheme = (next) => {
    if (isThemeId(next)) setThemeState(next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
