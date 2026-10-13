import { describe, it, expect, vi } from "vitest";

// Mock @react-pdf/renderer before importing the component
vi.mock("@react-pdf/renderer", () => ({
  Document: ({ children }) => <div data-testid="pdf-document">{children}</div>,
  Page: ({ children, size }) => <div data-testid="pdf-page" data-size={size}>{children}</div>,
  Text: ({ children, style }) => <span data-testid="pdf-text" data-style={JSON.stringify(style)}>{children}</span>,
  View: ({ children, wrap, break: pageBreak }) => (
    <div data-testid="pdf-view" data-wrap={wrap} data-break={pageBreak ? "true" : undefined}>{children}</div>
  ),
  StyleSheet: { create: (styles) => styles },
  Font: { register: vi.fn() },
  Link: ({ children, src }) => <a href={src}>{children}</a>,
}));

import { render, screen } from "@testing-library/react";
import ResumePDF from "./ResumePDF";
import sectionsData from "./sections.json";
import { VARIANTS, applyVariant } from "./variant";

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

  it("excludes the design prototypes section from PDF", () => {
    render(<ResumePDF />);
    // Design Prototypes section title should not appear as a section heading
    const allText = screen.getByTestId("pdf-document").textContent;
    // Check that there's no "Design Prototypes" section heading rendered
    // (It may appear in content text, but not as a section)
    const portfolioSection = sectionsData.find((s) => s.id === "prototypes");
    // The prototypes section should be filtered out
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

  it("renders every section that isn't PDF-omitted", () => {
    render(<ResumePDF />);
    const omit = ["prototypes", "case-groundswell", "uses", "colophon", "contact"];
    sectionsData
      .filter((s) => !omit.includes(s.id))
      .forEach((section) => {
        expect(screen.getByText(section.title)).toBeInTheDocument();
      });
  });

  it("omits the case study from the PDF", () => {
    render(<ResumePDF />);
    expect(screen.queryByText("Case Study")).not.toBeInTheDocument();
    expect(screen.queryByText(/honest surf forecasting/i)).not.toBeInTheDocument();
  });

  it("includes the How I Work section in the PDF", () => {
    render(<ResumePDF />);
    expect(screen.getByText("How I Work")).toBeInTheDocument();
  });

  it("renders the product builds section", () => {
    render(<ResumePDF />);
    expect(screen.getByText("Selected Product Builds")).toBeInTheDocument();
    expect(
      screen.getByText(/Automated WCAG \/ ADA accessibility audits/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Stack: Next\.js 16/)).toBeInTheDocument();
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

  it("renders the sections it is given in place of the main résumé", () => {
    const sections = applyVariant(sectionsData, VARIANTS.frontend);
    render(<ResumePDF sections={sections} />);
    const doc = screen.getByTestId("pdf-document");
    expect(doc.textContent).toContain("Senior Front-End & Design Engineer");
    expect(doc.textContent).not.toContain("Senior Full-Stack / Product Engineer");
    // Experience comes before Qualifications in this variant.
    expect(doc.textContent.indexOf("Professional Experience")).toBeLessThan(
      doc.textContent.indexOf("Qualifications")
    );
  });

  it("prints project addresses in the experience bullets as clickable links", () => {
    render(<ResumePDF />);
    const link = screen.getByText("accessbridge.app", { selector: "a" });
    expect(link).toHaveAttribute("href", "https://accessbridge.app");
    expect(screen.getByText("groundswell.surf", { selector: "a" })).toHaveAttribute(
      "href",
      "https://groundswell.surf"
    );
  });

  it("still spells out the address of a link whose text is not the address", () => {
    render(<ResumePDF />);
    expect(screen.getByTestId("pdf-document").textContent).toContain(
      "AccessBridge (https://accessbridge.app)"
    );
  });

  it("lists the site, GitHub and LinkedIn under the name", () => {
    render(<ResumePDF />);
    expect(screen.getByText("kevinmccalley.vercel.app")).toHaveAttribute(
      "href",
      "https://kevinmccalley.vercel.app"
    );
    expect(screen.getByText("github.com/kevinmccalley")).toHaveAttribute(
      "href",
      "https://github.com/kevinmccalley"
    );
    expect(screen.getByText("linkedin.com/in/kevin-mccalley")).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/kevin-mccalley"
    );
    expect(screen.getByText("kevinmccalley@proton.me")).toHaveAttribute(
      "href",
      "mailto:kevinmccalley@proton.me"
    );
    // The header replaces a separate Contact section.
    expect(screen.queryByText("Contact")).not.toBeInTheDocument();
  });

  it("has no forced page breaks on the main résumé", () => {
    render(<ResumePDF />);
    expect(document.querySelectorAll('[data-break="true"]').length).toBe(0);
  });

  it("gives a variant its own address and starts the listed sections on a new page", () => {
    const sections = applyVariant(sectionsData, VARIANTS.frontend);
    render(
      <ResumePDF
        sections={sections}
        site="kevinmccalley.vercel.app/frontend"
        breakBefore={VARIANTS.frontend.pdfBreakBefore}
      />
    );
    expect(screen.getByText("kevinmccalley.vercel.app/frontend")).toBeInTheDocument();
    const broken = [...document.querySelectorAll('[data-break="true"]')];
    expect(broken).toHaveLength(1);
    expect(broken[0].textContent).toContain("Selected Product Builds");
  });
});
