import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeSelector from "./ThemeSelector";
import { ThemeProvider } from "./ThemeContext";

function renderWithTheme(ui) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("ThemeSelector", () => {
  it("renders a toggle button", () => {
    renderWithTheme(<ThemeSelector />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("offers to switch to dark while in light mode", () => {
    renderWithTheme(<ThemeSelector />);
    const button = screen.getByRole("button", { name: /switch to dark theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/dark/i);
  });

  it("switches the theme when clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);

    await user.click(screen.getByRole("button", { name: /switch to dark theme/i }));

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(
      screen.getByRole("button", { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });

  it("toggles back to light on a second click", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);
    const btn = () => screen.getByRole("button");

    await user.click(btn());
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    await user.click(btn());
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("persists the choice to localStorage", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);
    await user.click(screen.getByRole("button"));
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
