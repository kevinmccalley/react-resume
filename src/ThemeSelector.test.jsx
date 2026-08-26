import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeSelector from "./ThemeSelector";
import { ThemeProvider, THEMES } from "./ThemeContext";

function renderWithTheme(ui) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("ThemeSelector", () => {
  it("renders a swatch button for every theme", () => {
    renderWithTheme(<ThemeSelector />);
    const group = screen.getByRole("group", { name: /colour theme/i });
    expect(group.querySelectorAll("button").length).toBe(THEMES.length);
  });

  it("labels each swatch with its theme name", () => {
    renderWithTheme(<ThemeSelector />);
    ["Light", "Dark", "Sea", "Coral", "Sand", "Jungle", "Neon"].forEach((name) => {
      expect(screen.getByRole("button", { name: `${name} theme` })).toBeInTheDocument();
    });
  });

  it("marks the active theme as pressed", () => {
    renderWithTheme(<ThemeSelector />);
    expect(screen.getByRole("button", { name: "Light theme" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Sea theme" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("switches the theme when a swatch is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);

    await user.click(screen.getByRole("button", { name: "Neon theme" }));

    expect(document.documentElement.getAttribute("data-theme")).toBe("neon");
    expect(screen.getByRole("button", { name: "Neon theme" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(localStorage.getItem("theme")).toBe("neon");
  });

  it("can move between several themes", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeSelector />);

    await user.click(screen.getByRole("button", { name: "Coral theme" }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("coral");

    await user.click(screen.getByRole("button", { name: "Sand theme" }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("sand");
  });
});
