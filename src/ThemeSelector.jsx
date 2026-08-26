import React from "react";
import { useTheme } from "./ThemeContext";

export default function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="theme-swatches" role="group" aria-label="Colour theme">
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          className="swatch"
          style={{ "--swatch": t.swatch }}
          aria-pressed={theme === t.id}
          aria-label={`${t.label} theme`}
          title={t.label}
          onClick={() => setTheme(t.id)}
        />
      ))}
    </div>
  );
}
