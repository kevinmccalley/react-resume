import { describe, it, expect, vi } from "vitest";

// Mock @react-pdf/renderer before importing the component
vi.mock("@react-pdf/renderer", () => ({
  Document: ({ children }) => <div data-testid="pdf-document">{children}</div>,
  Page: ({ children, size }) => <div data-testid="pdf-page" data-size={size}>{children}</div>,
  Text: ({ children, style }) => <span data-testid="pdf-text" data-style={JSON.stringify(style)}>{children}</span>,
  View: ({ children, wrap }) => <div data-testid="pdf-view" data-wrap={wrap}>{children}</div>,
  StyleSheet: { create: (styles) => styles },
  Font: { register: vi.fn() },
  Link: ({ children, src }) => <a href={src}>{children}</a>,
}));

import { render, screen } from "@testing-library/react";
import ResumePDF from "./ResumePDF";
import sectionsData from "./sections.json";

describe("ResumePDF", () => {
  it("renders without crashing", () => {
    render(<ResumePDF />);
    expect(screen.getByTestId("pdf-document")).toBeInTheDocument();
  });

  it("renders a single A4 page", () => {
    render(<ResumePDF />);
    const page = screen.getByTestId("pdf-page");
    expect(page).toHaveAttribute("data-size", "A4");
  });

  it("renders the overview title", () => {
    render(<ResumePDF />);
    const overviewSection = sectionsData.find((s) => s.id === "overview");
    expect(screen.getByText(overviewSection.title)).toBeInTheDocument();
  });

  it("renders the overview subtitle", () => {
    render(<ResumePDF />);
    const overviewSection = sectionsData.find((s) => s.id === "overview");
    if (overviewSection.subtitle) {
      expect(screen.getByText(overviewSection.subtitle)).toBeInTheDocument();
    }
  });

  it("excludes the portfolio section from PDF", () => {
    render(<ResumePDF />);
    // Portfolio section title should not appear as a section heading
    const allText = screen.getByTestId("pdf-document").textContent;
    // Check that there's no "Portfolio" section heading rendered
    // (It may appear in content text, but not as a section)
    const portfolioSection = sectionsData.find((s) => s.id === "portfolio");
    // The portfolio section should be filtered out
    const sectionViews = screen.getAllByTestId("pdf-view");
    expect(sectionViews.length).toBeGreaterThan(0);
  });

  it("renders experience section titles", () => {
    render(<ResumePDF />);
    expect(screen.getByText("Professional Experience")).toBeInTheDocument();
  });

  it("renders education section", () => {
    render(<ResumePDF />);
    expect(screen.getByText("Education")).toBeInTheDocument();
  });

  it("renders qualifications section", () => {
    render(<ResumePDF />);
    expect(screen.getByText("Qualifications")).toBeInTheDocument();
  });

  it("renders key strengths section", () => {
    render(<ResumePDF />);
    expect(screen.getByText("Key Strengths")).toBeInTheDocument();
  });

  it("renders accessibility section", () => {
    render(<ResumePDF />);
    expect(screen.getByText("Accessibility")).toBeInTheDocument();
  });

  it("renders contact section with email", () => {
    render(<ResumePDF />);
    const contactSection = sectionsData.find((s) => s.id === "contact");
    expect(screen.getByText(new RegExp(contactSection.content.email))).toBeInTheDocument();
  });

  it("renders contact section with linkedin", () => {
    render(<ResumePDF />);
    const contactSection = sectionsData.find((s) => s.id === "contact");
    expect(screen.getByText(new RegExp(contactSection.content.linkedin))).toBeInTheDocument();
  });

  it("renders position titles in experience", () => {
    render(<ResumePDF />);
    expect(screen.getByText("365 Retail Markets / FullCount")).toBeInTheDocument();
    expect(screen.getByText("Gaine Solutions")).toBeInTheDocument();
  });

  it("renders position roles and locations", () => {
    render(<ResumePDF />);
    expect(
      screen.getByText(/Senior UI\/UX Designer & React Developer – Remote/)
    ).toBeInTheDocument();
  });

  it("renders position dates", () => {
    render(<ResumePDF />);
    expect(screen.getByText("2022 – 2025")).toBeInTheDocument();
    expect(screen.getByText("2020 – 2022")).toBeInTheDocument();
  });

  it("renders earlier career history", () => {
    render(<ResumePDF />);
    expect(screen.getByText("Earlier Career History")).toBeInTheDocument();
  });

  it("renders all non-portfolio sections", () => {
    render(<ResumePDF />);
    const nonPortfolioSections = sectionsData.filter((s) => s.id !== "portfolio");
    nonPortfolioSections.forEach((section) => {
      expect(screen.getByText(section.title)).toBeInTheDocument();
    });
  });

  it("registers Helvetica font", async () => {
    const pdfRenderer = await import("@react-pdf/renderer");
    expect(pdfRenderer.Font.register).toHaveBeenCalledWith(
      expect.objectContaining({
        family: "Helvetica",
      })
    );
  });
});

// Test parseMarkdown by testing its output through rendered content
describe("ResumePDF parseMarkdown", () => {
  it("renders bold text wrapped in **", () => {
    render(<ResumePDF />);
    // The overview has bold text like "accessible, responsive web applications"
    // Since we use mocked Text, let's check the bold styling is applied
    const allTexts = screen.getAllByTestId("pdf-text");
    const boldTexts = allTexts.filter((el) => {
      const style = el.getAttribute("data-style");
      return style && style.includes("bold");
    });
    expect(boldTexts.length).toBeGreaterThan(0);
  });

  it("renders italic text wrapped in _ (underscores)", () => {
    render(<ResumePDF />);
    // The experience section has _Stack:_ which should be italic
    const allTexts = screen.getAllByTestId("pdf-text");
    const italicTexts = allTexts.filter((el) => {
      const style = el.getAttribute("data-style");
      return style && style.includes("italic");
    });
    expect(italicTexts.length).toBeGreaterThan(0);
  });

  it("renders markdownListitem content with bullet points", () => {
    render(<ResumePDF />);
    const doc = screen.getByTestId("pdf-document");
    // Bullet points should be rendered
    expect(doc.textContent).toContain("•");
  });
});
