import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme, ThemeContext } from "./ThemeContext";
import React from "react";

// Helper component to test the hook
function ThemeConsumer() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("orange")}>Set Orange</button>
      <button onClick={() => setTheme("cherry")}>Set Cherry</button>
      <button onClick={() => setTheme("lime")}>Set Lime</button>
    </div>
  );
}

describe("ThemeContext", () => {
  it("provides 'light' as default theme", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("reads theme from localStorage on mount", () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("updates theme when setTheme is called", async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("light");

    await act(async () => {
      screen.getByText("Set Dark").click();
    });
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("persists theme to localStorage", async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByText("Set Orange").click();
    });
    expect(localStorage.getItem("theme")).toBe("orange");
  });

  it("applies theme class to document.body", async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(document.body.classList.contains("theme-light")).toBe(true);

    await act(async () => {
      screen.getByText("Set Dark").click();
    });
    expect(document.body.classList.contains("theme-dark")).toBe(true);
    expect(document.body.classList.contains("theme-light")).toBe(false);
  });

  it("replaces old theme class when switching themes", async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByText("Set Cherry").click();
    });
    expect(document.body.classList.contains("theme-cherry")).toBe(true);

    await act(async () => {
      screen.getByText("Set Lime").click();
    });
    expect(document.body.classList.contains("theme-lime")).toBe(true);
    expect(document.body.classList.contains("theme-cherry")).toBe(false);
  });

  it("useTheme throws when used outside ThemeProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ThemeConsumer />)).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
    consoleError.mockRestore();
  });

  it("exports ThemeContext directly", () => {
    expect(ThemeContext).toBeDefined();
  });
});
