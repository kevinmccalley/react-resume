import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SkipLink from "./SkipLink";

describe("SkipLink", () => {
  it("renders a skip link", () => {
    render(<SkipLink />);
    const link = screen.getByText("Skip to Main Content");
    expect(link).toBeInTheDocument();
  });

  it("links to #main-content", () => {
    render(<SkipLink />);
    const link = screen.getByText("Skip to Main Content");
    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("has the skip-link class for styling", () => {
    render(<SkipLink />);
    const link = screen.getByText("Skip to Main Content");
    expect(link).toHaveClass("skip-link");
  });

  it("renders as an anchor element", () => {
    render(<SkipLink />);
    const link = screen.getByText("Skip to Main Content");
    expect(link.tagName).toBe("A");
  });
});
