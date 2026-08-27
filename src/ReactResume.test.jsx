import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeContext";
import sectionsData from "./sections.json";

// Mock @react-pdf/renderer to avoid real PDF rendering in tests
vi.mock("@react-pdf/renderer", () => ({
  PDFDownloadLink: ({ children, fileName, className }) => {
    const child = typeof children === "function" ? children({ loading: false }) : children;
    return (
      <a href="#" data-testid="pdf-download" data-filename={fileName} className={className}>
        {child}
      </a>
    );
  },
  Document: ({ children }) => <div>{children}</div>,
  Page: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <span>{children}</span>,
  View: ({ children }) => <div>{children}</div>,
  StyleSheet: { create: (s) => s },
  Font: { register: () => {} },
}));

import ReactResume from "./ReactResume";

function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function renderApp() {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <ThemeProvider>
        <ReactResume />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

async function waitForLoad() {
  await waitFor(() => {
    expect(document.querySelectorAll(".side-nav a").length).toBeGreaterThan(0);
  });
}

async function navigateTo(user, title) {
  const nav = document.querySelector(".side-nav");
  await user.click(within(nav).getByText(title).closest("a"));
}

describe("ReactResume", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(sectionsData),
    });
  });

  it("shows a loading state initially", () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {}));
    renderApp();
    expect(screen.getByText(/loading resume data/i)).toBeInTheDocument();
  });

  it("shows an error state when the fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: () => Promise.reject(new Error("fail")) });
    renderApp();
    await waitFor(() => expect(screen.getByText(/error loading data/i)).toBeInTheDocument());
  });

  it("shows an empty state when there are no sections", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    renderApp();
    await waitFor(() => expect(screen.getByText(/no sections found/i)).toBeInTheDocument());
  });

  it("fetches /sections.json", async () => {
    renderApp();
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/sections.json"));
  });

  it("renders a sidebar nav link for every section", async () => {
    renderApp();
    await waitForLoad();
    const nav = document.querySelector(".side-nav");
    expect(nav.querySelectorAll("a").length).toBe(sectionsData.length);
    sectionsData.forEach((s) => {
      expect(within(nav).getByText(s.title)).toBeInTheDocument();
    });
  });

  it("renders an icon for every sidebar item", async () => {
    renderApp();
    await waitForLoad();
    expect(document.querySelectorAll(".side-nav .menu-icon").length).toBe(sectionsData.length);
  });

  it("renders the identity block", async () => {
    renderApp();
    await waitForLoad();
    const sidebar = document.querySelector(".sidebar");
    expect(within(sidebar).getByText("Kevin McCalley")).toBeInTheDocument();
  });

  it("renders the mobile menu button", async () => {
    renderApp();
    await waitForLoad();
    const btn = document.querySelector(".mobile-menu-btn");
    expect(btn).toHaveAttribute("aria-label", "Toggle menu");
  });

  it("toggles the mobile menu open and closed", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();
    const btn = document.querySelector(".mobile-menu-btn");
    const sidebar = document.querySelector(".sidebar");

    expect(sidebar).not.toHaveClass("open");
    await user.click(btn);
    expect(sidebar).toHaveClass("open");
    await user.click(btn);
    expect(sidebar).not.toHaveClass("open");
  });

  it("closes the mobile menu when a nav link is clicked", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await user.click(document.querySelector(".mobile-menu-btn"));
    expect(document.querySelector(".sidebar")).toHaveClass("open");

    await user.click(document.querySelector(".side-nav a"));
    expect(document.querySelector(".sidebar")).not.toHaveClass("open");
  });

  it("renders the theme swatches in the sidebar", async () => {
    renderApp();
    await waitForLoad();
    const sidebar = document.querySelector(".sidebar");
    const group = within(sidebar).getByRole("group", { name: /colour theme/i });
    expect(group.querySelectorAll("button.swatch").length).toBeGreaterThanOrEqual(5);
    expect(within(sidebar).getByRole("button", { name: /sea theme/i })).toBeInTheDocument();
  });

  it("renders the PDF download link with the right filename", async () => {
    renderApp();
    await waitForLoad();
    const link = screen.getByTestId("pdf-download");
    expect(link).toHaveAttribute("data-filename", "Kevin_McCalley_Resume.pdf");
    expect(screen.getByText("Download PDF")).toBeInTheDocument();
  });

  it("redirects the root path to /overview", async () => {
    renderApp();
    await waitForLoad();
    const main = document.querySelector("main");
    await waitFor(() => expect(within(main).getByText("Overview")).toBeInTheDocument());
  });

  it("renders section content based on the route", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();
    await navigateTo(user, "Qualifications");
    await waitFor(() => {
      const main = document.querySelector("main");
      expect(within(main).getByText("Qualifications")).toBeInTheDocument();
    });
  });

  it("renders the product builds section with cards", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();
    await navigateTo(user, "Selected Product Builds");
    await waitFor(() => {
      expect(screen.getByText("AccessBridge")).toBeInTheDocument();
      expect(screen.getByText("Groundswell")).toBeInTheDocument();
      expect(screen.getByText("S&P Daily")).toBeInTheDocument();
      expect(screen.getByText("GoodStockPress")).toBeInTheDocument();
    });
    expect(document.querySelectorAll(".build-card").length).toBe(7);
  });

  it("gives every external build link a safe new-tab target", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();
    await navigateTo(user, "Selected Product Builds");
    await waitFor(() => {
      const links = document.querySelectorAll(".build-card a.build-link");
      expect(links.length).toBe(7);
      links.forEach((a) => {
        expect(a).toHaveAttribute("target", "_blank");
        expect(a).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  it("renders the design prototypes section with project cards", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();
    await navigateTo(user, "Design Prototypes");
    await waitFor(() => {
      expect(screen.getByText("Keyboard User Interface")).toBeInTheDocument();
      expect(screen.getByText("Enhanced Search")).toBeInTheDocument();
      expect(document.querySelectorAll(".portfolio-item").length).toBe(6);
      expect(document.querySelectorAll(".portfolio-thumbnail").length).toBe(6);
    });
  });

  it("opens prototype links in a new tab", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();
    await navigateTo(user, "Design Prototypes");
    await waitFor(() => {
      const items = document.querySelectorAll(".portfolio-item");
      expect(items.length).toBeGreaterThan(0);
      items.forEach((a) => {
        expect(a).toHaveAttribute("target", "_blank");
        expect(a).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  it("renders the Groundswell case study as ordered steps", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();
    await navigateTo(user, "Case Study");
    await waitFor(() => {
      const steps = document.querySelectorAll(".case-study .case-step");
      expect(steps.length).toBe(4);
      expect(screen.getByText("The hard part")).toBeInTheDocument();
      expect(screen.getByText(/genuine repeat use/i)).toBeInTheDocument();
    });
  });

  it("renders the experience section with positions", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();
    await navigateTo(user, "Professional Experience");
    await waitFor(() => {
      expect(screen.getByText("Independent")).toBeInTheDocument();
      expect(screen.getByText("365 Retail Markets / FullCount")).toBeInTheDocument();
      expect(screen.getByText("Gaine Solutions")).toBeInTheDocument();
    });
  });

  it("renders the contact section with the form and details", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();
    await navigateTo(user, "Contact");
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByText("kevinmccalley@proton.me")).toBeInTheDocument();
      expect(screen.getByText("kevin-mccalley")).toBeInTheDocument();
      const md = screen.getByText(/plain-text \/ markdown version/i);
      expect(md).toHaveAttribute("href", "/kevin-mccalley-resume.md");
      expect(md).toHaveAttribute("download");
    });
  });

  it("renders the How I Work section", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();
    await navigateTo(user, "How I Work");
    await waitFor(() => {
      expect(screen.getByText(/Taste is the constraint, not the tool/i)).toBeInTheDocument();
      expect(screen.getByText(/I own what ships/i)).toBeInTheDocument();
    });
  });

  it("exposes a skip link that targets the main content", async () => {
    renderApp();
    await waitForLoad();
    const skip = screen.getByText(/skip to main content/i);
    expect(skip).toHaveAttribute("href", "#main-content");
    expect(document.getElementById("main-content")).toBeInTheDocument();
  });

  it("renders a 404 section for an unknown route", async () => {
    window.history.pushState({}, "", "/no-such-page");
    renderApp();
    await waitForLoad();
    await waitFor(() => {
      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByText(/isn.t on the r.sum/i)).toBeInTheDocument();
      expect(
        within(document.querySelector(".notfound-links")).getByText("Overview")
      ).toBeInTheDocument();
    });
    window.history.pushState({}, "", "/");
  });

  it("moves between sections with j / k and g-then-key", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/overview");
    renderApp();
    await waitForLoad();

    await user.keyboard("j");
    await waitFor(() => {
      expect(document.querySelector(".side-nav a.active-menu-item")).toHaveTextContent(
        "Qualifications"
      );
    });

    await user.keyboard("gb");
    await waitFor(() => {
      expect(document.querySelector(".side-nav a.active-menu-item")).toHaveTextContent(
        "Selected Product Builds"
      );
    });
    window.history.pushState({}, "", "/");
  });

  it("toggles the keyboard shortcuts panel with ? and Escape", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await user.keyboard("?");
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /keyboard shortcuts/i })).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /keyboard shortcuts/i })
      ).not.toBeInTheDocument();
    });
  });
});
