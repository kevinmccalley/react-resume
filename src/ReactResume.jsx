import React, { useState } from "react";
import {
  FaFilter,
  FaGavel,
  FaBuilding,
  FaHistory,
  FaSchool,
  FaBullseye,
  FaUniversalAccess,
  FaAddressCard,
  FaBars,
} from "react-icons/fa";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import ThemeSelector from "./ThemeSelector";
import ContactForm from "./ContactForm"; // Import ContactForm here
import "./ReactResume.css";
import { useQuery } from "@tanstack/react-query";

// Map icon names from JSON to actual components
const iconMap = {
  FaFilter: <FaFilter className="text-xl" />,
  FaGavel: <FaGavel className="text-xl" />,
  FaBuilding: <FaBuilding className="text-xl" />,
  FaHistory: <FaHistory className="text-xl" />,
  FaSchool: <FaSchool className="text-xl" />,
  FaBullseye: <FaBullseye className="text-xl" />,
  FaUniversalAccess: <FaUniversalAccess className="text-xl" />,
  FaAddressCard: <FaAddressCard className="text-xl" />,
  // add more if needed
};

// Helper to render content based on type
function RenderContent({ content }) {
  if (typeof content === "string") {
    // simple string content with newlines to <br />
    return content.split("\n").map((line, i) => (
      <p key={i} style={{ marginTop: i === 0 ? 0 : "0.75rem" }}>
        {line}
      </p>
    ));
  }
  if (Array.isArray(content)) {
    // content is an array of objects (like paragraphs, lists, positions)
    return content.map((item, idx) => {
      switch (item.type) {
        case "paragraph":
          return (
            <p key={idx} style={{ marginBottom: "0.75rem" }}>
              {item.text}
            </p>
          );
        case "list":
          return (
            <div key={idx} style={{ marginBottom: "1rem" }}>
              {item.title && <strong>{item.title}:</strong>}
              <ul className="list-disc pl-5">
                {item.items.map((li, i) => (
                  <li key={i}>{li}</li>
                ))}
              </ul>
            </div>
          );
        case "position":
          return (
            <div key={idx} style={{ marginBottom: "1rem" }}>
              <p>
                <strong>{item.title}</strong> <br />
                <em>
                  {item.role} – {item.location}
                </em>{" "}
                <br />
                <small>{item.date}</small>
              </p>
              <ul className="list-disc pl-5 mt-1">
                {item.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          );
        default:
          return null;
      }
    });
  }
  if (typeof content === "object" && content !== null) {
    // For example, contact info object
    return (
      <div className="contact-content">
        {content.email && (
          <div>
            <strong>Email:</strong> {content.email}
          </div>
        )}
        {content.linkedin && (
          <div>
            <strong>LinkedIn:</strong> {content.linkedin}
          </div>
        )}
      </div>
    );
  }
  return null;
}

function SectionContent({ section }) {
  // Special case for Contact section to include ContactForm above contact info
  if (section.id === "contact") {
    return (
      <section id={section.id} className="scroll-mt-20">
        <h2>
          {iconMap[section.icon] || null} {section.title}
        </h2>
        <div>
          <ContactForm />
          <div style={{ marginTop: "2rem" }}>
            <RenderContent content={section.content} />
          </div>
        </div>
      </section>
    );
  }

  // Default rendering for other sections
  return (
    <section id={section.id} className="scroll-mt-20">
      <h2>
        {iconMap[section.icon] || null} {section.title}
      </h2>
      <div>
        <RenderContent content={section.content} />
      </div>
    </section>
  );
}

export default function ReactResume() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: sections, isLoading, error } = useQuery({
    queryKey: ["sections"],
    queryFn: () =>
      fetch("/sections.json").then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      }),
  });

  if (isLoading) return <div>Loading resume data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (!sections || !sections.length)
    return <div>No sections found in resume data.</div>;

  return (
    <Router>
      <ThemeSelector />
      <div className="app-container">
        <nav className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
          {sections.map(({ id, title, icon }) => (
            <NavLink
              key={id}
              to={`/${id}`}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "active-menu-item" : undefined
              }
            >
              <span className="menu-icon">{iconMap[icon]}</span>
              <span className="menu-text">{title}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <FaBars size={24} />
        </button>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            {sections.map(({ id }) => (
              <Route
                key={id}
                path={`/${id}`}
                element={<SectionContent section={sections.find((s) => s.id === id)} />}
              />
            ))}
            <Route path="*" element={<div>Page not found.</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
