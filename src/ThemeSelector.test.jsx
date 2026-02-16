import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeSelector from "./ThemeSelector";
import { ThemeProvider } from "./ThemeContext";

function renderWithTheme(ui) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("ThemeSelector", () => {
  it("renders the theme selector button", () => {
    renderWithTheme(<ThemeSelector />);
    const button = screen.getByRole("button", { name: /select theme/i });
    expect(button).toBeInTheDocument();
  });

  it("opens the theme menu on click", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);
    const button = screen.getByRole("button", { name: /select theme/i });
    await user.click(button);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("displays all five theme options", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);
    await user.click(screen.getByRole("button", { name: /select theme/i }));

    expect(screen.getByRole("menuitem", { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /orange/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /cherry/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /lime/i })).toBeInTheDocument();
  });

  it("changes theme when a menu item is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);
    await user.click(screen.getByRole("button", { name: /select theme/i }));
    await user.click(screen.getByRole("menuitem", { name: /dark/i }));

    expect(document.body.classList.contains("theme-dark")).toBe(true);
  });

  it("closes the menu after selecting a theme", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);
    await user.click(screen.getByRole("button", { name: /select theme/i }));
    await user.click(screen.getByRole("menuitem", { name: /orange/i }));

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("marks the current theme as selected", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);
    await user.click(screen.getByRole("button", { name: /select theme/i }));

    // Default is light, so light should be selected
    const lightItem = screen.getByRole("menuitem", { name: /light/i });
    expect(lightItem).toHaveClass("Mui-selected");
  });

  it("has proper aria attributes on the button", () => {
    renderWithTheme(<ThemeSelector />);
    const button = screen.getByRole("button", { name: /select theme/i });
    expect(button).toHaveAttribute("aria-haspopup", "true");
  });

  it("sets aria-expanded when menu is open", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);
    const button = screen.getByRole("button", { name: /select theme/i });

    expect(button).not.toHaveAttribute("aria-expanded", "true");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("persists theme selection to localStorage", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);
    await user.click(screen.getByRole("button", { name: /select theme/i }));
    await user.click(screen.getByRole("menuitem", { name: /cherry/i }));

    expect(localStorage.getItem("theme")).toBe("cherry");
  });

  it("switches between multiple themes correctly", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);

    // Switch to lime
    await user.click(screen.getByRole("button", { name: /select theme/i }));
    await user.click(screen.getByRole("menuitem", { name: /lime/i }));
    expect(document.body.classList.contains("theme-lime")).toBe(true);

    // Switch to dark
    await user.click(screen.getByRole("button", { name: /select theme/i }));
    await user.click(screen.getByRole("menuitem", { name: /dark/i }));
    expect(document.body.classList.contains("theme-dark")).toBe(true);
    expect(document.body.classList.contains("theme-lime")).toBe(false);
  });
});
