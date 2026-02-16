import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Section from "./Section";
import { ThemeProvider } from "./ThemeContext";

function renderWithTheme(ui) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Section", () => {
  it("returns null when section is null", () => {
    const { container } = renderWithTheme(<Section section={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("returns null when section is undefined", () => {
    const { container } = renderWithTheme(<Section section={undefined} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders section with title", () => {
    const section = { id: "overview", title: "Overview", content: "Some text" };
    renderWithTheme(<Section section={section} />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  it("renders section with subtitle", () => {
    const section = {
      id: "overview",
      title: "Overview",
      subtitle: "Kevin McCalley",
      content: "Some text",
    };
    renderWithTheme(<Section section={section} />);
    expect(screen.getByText("Kevin McCalley")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    const section = { id: "overview", title: "Overview", content: "Some text" };
    renderWithTheme(<Section section={section} />);
    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  });

  it("renders string content as paragraph", () => {
    const section = { id: "test", title: "Test", content: "Hello World" };
    renderWithTheme(<Section section={section} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders icon when icon prop matches iconMap", () => {
    const section = { id: "test", title: "Test", icon: "FaFilter", content: "Content" };
    renderWithTheme(<Section section={section} />);
    // FaFilter icon should be rendered (svg element)
    const heading = screen.getByText("Test").closest("h2");
    expect(heading.querySelector("svg")).toBeInTheDocument();
  });

  it("renders position content type", () => {
    const section = {
      id: "experience",
      title: "Experience",
      content: [
        {
          type: "position",
          title: "Company ABC",
          role: "Developer",
          location: "Remote",
          date: "2020-2023",
          bullets: ["Built stuff", "Fixed bugs"],
        },
      ],
    };
    renderWithTheme(<Section section={section} />);
    expect(screen.getByText("Company ABC")).toBeInTheDocument();
    expect(screen.getByText(/Developer – Remote/)).toBeInTheDocument();
    expect(screen.getByText("2020-2023")).toBeInTheDocument();
  });

  it("renders position bullets", () => {
    const section = {
      id: "experience",
      title: "Experience",
      content: [
        {
          type: "position",
          title: "Company ABC",
          role: "Developer",
          location: "Remote",
          date: "2020-2023",
          bullets: ["Built React apps", "Improved performance"],
        },
      ],
    };
    renderWithTheme(<Section section={section} />);
    expect(screen.getByText("Built React apps")).toBeInTheDocument();
    expect(screen.getByText("Improved performance")).toBeInTheDocument();
  });

  it("renders contact content with email and linkedin", () => {
    const section = {
      id: "contact",
      title: "Contact",
      icon: "FaAddressCard",
      content: {
        email: "test@example.com",
        linkedin: "testuser",
      },
    };
    renderWithTheme(<Section section={section} />);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("renders contact section with ContactForm", () => {
    const section = {
      id: "contact",
      title: "Contact",
      icon: "FaAddressCard",
      content: {
        email: "test@example.com",
        linkedin: "testuser",
      },
    };
    renderWithTheme(<Section section={section} />);
    // ContactForm should render the "I am human" switch
    expect(screen.getByLabelText(/i am human/i)).toBeInTheDocument();
  });

  it("renders section with correct id attribute", () => {
    const section = { id: "education", title: "Education", content: "BA English" };
    renderWithTheme(<Section section={section} />);
    expect(document.getElementById("education")).toBeInTheDocument();
  });

  it("renders object content with only email", () => {
    const section = {
      id: "contact",
      title: "Contact",
      content: { email: "test@example.com" },
    };
    renderWithTheme(<Section section={section} />);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders object content with only linkedin", () => {
    const section = {
      id: "contact",
      title: "Contact",
      content: { linkedin: "testuser" },
    };
    renderWithTheme(<Section section={section} />);
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("returns null for unknown content types in array", () => {
    const section = {
      id: "test",
      title: "Test",
      content: [{ type: "unknown", text: "Should not render" }],
    };
    renderWithTheme(<Section section={section} />);
    expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
  });

  it("handles null content gracefully", () => {
    const section = { id: "test", title: "Test", content: null };
    renderWithTheme(<Section section={section} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
