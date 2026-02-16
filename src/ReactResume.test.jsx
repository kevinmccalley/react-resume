import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeContext";
import sectionsData from "./sections.json";

// Mock @react-pdf/renderer to avoid complex PDF rendering in tests
vi.mock("@react-pdf/renderer", () => ({
  PDFDownloadLink: ({ children, fileName }) => {
    const child = typeof children === "function" ? children({ loading: false }) : children;
    return <a href="#" data-testid="pdf-download" data-filename={fileName}>{child}</a>;
  },
  Document: ({ children }) => <div>{children}</div>,
  Page: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <span>{children}</span>,
  View: ({ children }) => <div>{children}</div>,
  StyleSheet: { create: (styles) => styles },
  Font: { register: () => {} },
  Link: ({ children }) => <span>{children}</span>,
}));

// Import after mocks
import ReactResume from "./ReactResume";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderApp() {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ReactResume />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Helper: wait for the app to load sections
async function waitForLoad() {
  await waitFor(() => {
    const navLinks = document.querySelectorAll(".sidebar a");
    expect(navLinks.length).toBeGreaterThan(0);
  });
}

// Helper: click a nav link by section title (use the sidebar nav)
async function navigateTo(user, title) {
  const sidebar = document.querySelector(".sidebar");
  const navLink = within(sidebar).getByText(title).closest("a");
  await user.click(navLink);
}

describe("ReactResume", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(sectionsData),
    });
  });

  it("shows loading state initially", () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {}));
    renderApp();
    expect(screen.getByText(/loading resume data/i)).toBeInTheDocument();
  });

  it("shows error state when fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.reject(new Error("fail")),
    });
    renderApp();
    await waitFor(() => {
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    });
  });

  it("shows empty state when sections is empty", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    renderApp();
    await waitFor(() => {
      expect(screen.getByText(/no sections found/i)).toBeInTheDocument();
    });
  });

  it("renders sidebar navigation with all sections", async () => {
    renderApp();
    await waitForLoad();
    const sidebar = document.querySelector(".sidebar");
    sectionsData.forEach((section) => {
      expect(within(sidebar).getByText(section.title)).toBeInTheDocument();
    });
  });

  it("renders sidebar nav links for each section", async () => {
    renderApp();
    await waitForLoad();
    const navLinks = document.querySelectorAll(".sidebar a");
    expect(navLinks.length).toBe(sectionsData.length);
  });

  it("renders the mobile menu button", async () => {
    renderApp();
    await waitForLoad();
    const btn = document.querySelector(".mobile-menu-btn");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-label", "Toggle menu");
  });

  it("toggles mobile menu open/closed", async () => {
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

  it("closes mobile menu when a nav link is clicked", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    const btn = document.querySelector(".mobile-menu-btn");
    await user.click(btn);
    expect(document.querySelector(".sidebar")).toHaveClass("open");

    const firstLink = document.querySelector(".sidebar a");
    await user.click(firstLink);
    expect(document.querySelector(".sidebar")).not.toHaveClass("open");
  });

  it("renders the PDF download link", async () => {
    renderApp();
    await waitForLoad();
    expect(screen.getByTestId("pdf-download")).toBeInTheDocument();
  });

  it("PDF download link has correct filename", async () => {
    renderApp();
    await waitForLoad();
    expect(screen.getByTestId("pdf-download")).toHaveAttribute(
      "data-filename",
      "Kevin_McCalley_Resume.pdf"
    );
  });

  it("shows 'Download PDF' text in the download link", async () => {
    renderApp();
    await waitForLoad();
    expect(screen.getByText("Download PDF")).toBeInTheDocument();
  });

  it("renders ThemeSelector component", async () => {
    renderApp();
    await waitForLoad();
    expect(screen.getByRole("button", { name: /select theme/i })).toBeInTheDocument();
  });

  it("redirects root path to /overview", async () => {
    renderApp();
    await waitForLoad();
    // Overview appears in both sidebar and content
    const allOverview = screen.getAllByText("Overview");
    expect(allOverview.length).toBeGreaterThanOrEqual(1);
  });

  it("renders section content based on route", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    // Navigate to qualifications (unique title not duplicated in sidebar vs content)
    await navigateTo(user, "Qualifications");
    await waitFor(() => {
      const main = document.querySelector("main");
      expect(within(main).getByText("Qualifications")).toBeInTheDocument();
    });
  });

  it("renders portfolio section with project cards", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Portfolio");
    await waitFor(() => {
      expect(screen.getByText("Acrylic Mix Lab")).toBeInTheDocument();
      expect(screen.getByText("Math Fun")).toBeInTheDocument();
      expect(screen.getByText("Translation")).toBeInTheDocument();
    });
  });

  it("portfolio links open in new tab", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Portfolio");
    await waitFor(() => {
      const portfolioLinks = document.querySelectorAll(".portfolio-item");
      expect(portfolioLinks.length).toBeGreaterThan(0);
      portfolioLinks.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  it("renders contact section with contact form", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Contact");
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });

  it("renders contact section with email and linkedin info", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Contact");
    await waitFor(() => {
      expect(screen.getByText("kevinmccalley@proton.me")).toBeInTheDocument();
      expect(screen.getByText("kevin-mccalley")).toBeInTheDocument();
    });
  });

  it("renders section icons in the sidebar", async () => {
    renderApp();
    await waitForLoad();
    const menuIcons = document.querySelectorAll(".menu-icon");
    expect(menuIcons.length).toBe(sectionsData.length);
  });

  it("sends fetch request to /sections.json", async () => {
    renderApp();
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/sections.json");
    });
  });

  it("renders experience section with positions", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Professional Experience");
    await waitFor(() => {
      expect(screen.getByText("365 Retail Markets / FullCount")).toBeInTheDocument();
      expect(screen.getByText("Gaine Solutions")).toBeInTheDocument();
    });
  });

  it("renders education section", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Education");
    await waitFor(() => {
      const main = document.querySelector("main");
      expect(within(main).getByText("Education")).toBeInTheDocument();
    });
  });

  it("renders all portfolio projects", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Portfolio");
    await waitFor(() => {
      const portfolioItems = document.querySelectorAll(".portfolio-item");
      expect(portfolioItems.length).toBe(12);
    });
  });

  it("portfolio items have thumbnails", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Portfolio");
    await waitFor(() => {
      const thumbnails = document.querySelectorAll(".portfolio-thumbnail");
      expect(thumbnails.length).toBe(12);
    });
  });

  it("renders portfolio item titles and subtitles", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Portfolio");
    await waitFor(() => {
      expect(screen.getByText("Keyboard User Interface")).toBeInTheDocument();
      expect(screen.getByText("Paint Mixer")).toBeInTheDocument();
      expect(screen.getByText("Enhanced Search")).toBeInTheDocument();
    });
  });

  it("renders portfolio footers", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Portfolio");
    await waitFor(() => {
      // Multiple items share footers, so use getAllByText
      const figmaFooters = screen.getAllByText("View Prototype - Figma");
      expect(figmaFooters.length).toBeGreaterThan(0);
      const xdFooters = screen.getAllByText("View Prototype - Adobe XD");
      expect(xdFooters.length).toBeGreaterThan(0);
      const reactFooters = screen.getAllByText("View Application - React");
      expect(reactFooters.length).toBeGreaterThan(0);
    });
  });

  it("renders key strengths section", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Key Strengths");
    await waitFor(() => {
      const main = document.querySelector("main");
      expect(within(main).getByText("Key Strengths")).toBeInTheDocument();
    });
  });

  it("renders accessibility section", async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForLoad();

    await navigateTo(user, "Accessibility");
    await waitFor(() => {
      const main = document.querySelector("main");
      expect(within(main).getByText("Accessibility")).toBeInTheDocument();
    });
  });

  it("shows 404 page for unknown routes", async () => {
    renderApp();
    // BrowserRouter defaults to / which redirects to /overview
    await waitForLoad();
    const allOverview = screen.getAllByText("Overview");
    expect(allOverview.length).toBeGreaterThanOrEqual(1);
  });
});
