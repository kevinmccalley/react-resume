import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

// Mock lazy-loaded sections
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    lazy: vi.fn((factory) => {
      // Return a simple component instead of lazy loading
      const Component = () => <div data-testid="lazy-section">Section Content</div>;
      Component.displayName = "LazySectionMock";
      return Component;
    }),
  };
});

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    });
    render(<App />);
    expect(document.querySelector(".font-sans")).toBeInTheDocument();
  });

  it("fetches sections.json on mount", () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    });
    render(<App />);
    expect(global.fetch).toHaveBeenCalledWith("/sections.json");
  });

  it("renders header navigation links for each section", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve([
          { id: "summary", label: "Summary" },
          { id: "skills", label: "Skills" },
        ]),
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Summary")).toBeInTheDocument();
      expect(screen.getByText("Skills")).toBeInTheDocument();
    });
  });

  it("navigation links have correct href anchors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve([
          { id: "summary", label: "Summary" },
          { id: "skills", label: "Skills" },
        ]),
    });
    render(<App />);
    await waitFor(() => {
      const summaryLink = screen.getByText("Summary").closest("a");
      expect(summaryLink).toHaveAttribute("href", "#summary");
      const skillsLink = screen.getByText("Skills").closest("a");
      expect(skillsLink).toHaveAttribute("href", "#skills");
    });
  });

  it("renders main content area with correct id and tabIndex", () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    });
    render(<App />);
    const main = document.getElementById("main-content");
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute("tabindex", "-1");
  });

  it("renders a sticky header", () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    });
    render(<App />);
    const header = document.querySelector("header");
    expect(header).toHaveClass("sticky");
  });

  it("renders section containers for each loaded section", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve([
          { id: "summary", label: "Summary" },
          { id: "experience", label: "Experience" },
        ]),
    });
    render(<App />);
    await waitFor(() => {
      expect(document.getElementById("summary")).toBeInTheDocument();
      expect(document.getElementById("experience")).toBeInTheDocument();
    });
  });

  it("handles fetch error gracefully", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    render(<App />);
    // Should not crash
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });
    consoleError.mockRestore();
  });

  it("renders icons in header links", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve([
          { id: "skills", label: "Skills" },
        ]),
    });
    render(<App />);
    await waitFor(() => {
      const link = screen.getByText("Skills").closest("a");
      expect(link.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("maps icon IDs correctly to iconMap", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve([
          { id: "summary", label: "Summary" },
          { id: "skills", label: "Skills" },
          { id: "experience", label: "Experience" },
          { id: "education", label: "Education" },
          { id: "volunteer", label: "Volunteer" },
          { id: "projects", label: "Projects" },
          { id: "awards", label: "Awards" },
          { id: "history", label: "History" },
        ]),
    });
    render(<App />);
    await waitFor(() => {
      // All icons should render as svgs in their links
      const links = document.querySelectorAll("header a");
      expect(links.length).toBe(8);
      links.forEach((link) => {
        expect(link.querySelector("svg")).toBeInTheDocument();
      });
    });
  });
});
