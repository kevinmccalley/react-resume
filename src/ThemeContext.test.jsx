import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme, ThemeContext } from "./ThemeContext";

function ThemeConsumer() {
  const { theme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

function renderConsumer() {
  return render(
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>
  );
}

describe("ThemeContext", () => {
  it("defaults to 'light' when nothing is stored and OS is not dark", () => {
    renderConsumer();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("reads a stored theme from localStorage on mount", () => {
    localStorage.setItem("theme", "dark");
    renderConsumer();
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("updates the theme when setTheme is called", async () => {
    renderConsumer();
    await act(async () => screen.getByText("Set Dark").click());
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("flips the theme when toggleTheme is called", async () => {
    renderConsumer();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    await act(async () => screen.getByText("Toggle").click());
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    await act(async () => screen.getByText("Toggle").click());
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("persists the theme to localStorage", async () => {
    renderConsumer();
    await act(async () => screen.getByText("Set Dark").click());
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("reflects the theme on the document element via data-theme", async () => {
    renderConsumer();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    await act(async () => screen.getByText("Set Dark").click());
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("throws when useTheme is used outside a ThemeProvider", () => {
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
