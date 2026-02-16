import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import { ThemeProvider } from "./ThemeContext";

function renderWithTheme(ui) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Header", () => {
  it("renders the menu button", () => {
    renderWithTheme(<Header />);
    expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    renderWithTheme(<Header />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders close menu button", () => {
    renderWithTheme(<Header />);
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
  });

  it("sidebar starts closed", () => {
    renderWithTheme(<Header />);
    const sidebar = document.querySelector(".sidebar");
    expect(sidebar).not.toHaveClass("open");
  });

  it("opens sidebar when menu button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header />);
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const sidebar = document.querySelector(".sidebar");
    expect(sidebar).toHaveClass("open");
  });

  it("shows overlay when menu is open", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header />);
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(document.querySelector(".overlay")).toBeInTheDocument();
  });

  it("closes sidebar when overlay is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header />);
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(document.querySelector(".sidebar")).toHaveClass("open");

    await user.click(document.querySelector(".overlay"));
    expect(document.querySelector(".sidebar")).not.toHaveClass("open");
  });

  it("closes sidebar when close button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header />);
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(document.querySelector(".sidebar")).toHaveClass("open");

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(document.querySelector(".sidebar")).not.toHaveClass("open");
  });

  it("closes sidebar when nav item is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header />);
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(document.querySelector(".sidebar")).toHaveClass("open");

    await user.click(screen.getByText("About"));
    expect(document.querySelector(".sidebar")).not.toHaveClass("open");
  });

  it("includes the ThemeSelector inside the sidebar", () => {
    renderWithTheme(<Header />);
    expect(screen.getByText("Theme")).toBeInTheDocument();
  });

  it("renders theme circles", () => {
    renderWithTheme(<Header />);
    const themeCircles = document.querySelectorAll(".theme-circle");
    expect(themeCircles.length).toBe(5);
  });

  it("toggles menu open and closed with menu button", async () => {
    const user = userEvent.setup();
    renderWithTheme(<Header />);
    const menuButton = screen.getByRole("button", { name: /open menu/i });

    await user.click(menuButton);
    expect(document.querySelector(".sidebar")).toHaveClass("open");

    await user.click(menuButton);
    expect(document.querySelector(".sidebar")).not.toHaveClass("open");
  });

  it("renders as a header element", () => {
    renderWithTheme(<Header />);
    expect(document.querySelector("header")).toBeInTheDocument();
  });
});
