import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme, ThemeContext, THEMES } from "./ThemeContext";

function ThemeConsumer() {
  const { theme, setTheme, themes } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="count">{themes.length}</span>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("sea")}>Set Sea</button>
      <button onClick={() => setTheme("not-a-theme")}>Set Bogus</button>
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
    localStorage.setItem("theme", "jungle");
    renderConsumer();
    expect(screen.getByTestId("theme")).toHaveTextContent("jungle");
  });

  it("ignores an invalid stored value", () => {
    localStorage.setItem("theme", "chartreuse");
    renderConsumer();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("exposes the full theme list", () => {
    renderConsumer();
    expect(screen.getByTestId("count")).toHaveTextContent(String(THEMES.length));
    expect(THEMES.map((t) => t.id)).toEqual(
      expect.arrayContaining(["light", "dark", "sea", "coral", "jungle"])
    );
  });

  it("updates the theme when setTheme is called with a valid id", async () => {
    renderConsumer();
    await act(async () => screen.getByText("Set Sea").click());
    expect(screen.getByTestId("theme")).toHaveTextContent("sea");
  });

  it("rejects setTheme with an unknown id", async () => {
    renderConsumer();
    await act(async () => screen.getByText("Set Bogus").click());
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
    await act(async () => screen.getByText("Set Sea").click());
    expect(document.documentElement.getAttribute("data-theme")).toBe("sea");
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
