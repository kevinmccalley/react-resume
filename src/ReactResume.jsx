// ReactResume.jsx
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
  FaBriefcase,
} from "react-icons/fa";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ThemeSelector from "./ThemeSelector";
import ContactForm from "./ContactForm";
import ResumePDF from "./ResumePDF";
import "./ReactResume.css";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "./ThemeContext";

// Map icon names from JSON to components
const iconMap = {
  FaFilter: <FaFilter className="text-xl" />,
  FaGavel: <FaGavel className="text-xl" />,
  FaBuilding: <FaBuilding className="text-xl" />,
  FaHistory: <FaHistory className="text-xl" />,
  FaSchool: <FaSchool className="text-xl" />,
  FaBullseye: <FaBullseye className="text-xl" />,
  FaUniversalAccess: <FaUniversalAccess className="text-xl" />,
  FaAddressCard: <FaAddressCard className="text-xl" />,
  FaBriefcase: <FaBriefcase className="text-xl" />,
};

// ---------- RenderContent ----------
function RenderContent({ content }) {
  if (typeof content === "string") {
    return <p>{content}</p>;
  }

  if (Array.isArray(content)) {
    return content.map((item, idx) => {
      switch (item.type) {
        case "paragraph":
          return (
            <p key={idx} style={{ marginBottom: "0.75rem" }}>
              {item.text}
            </p>
          );

        case "markdown":
          return (
            <div key={idx} style={{ marginBottom: "0.75rem" }}>
              <ReactMarkdown>{item.text}</ReactMarkdown>
            </div>
          );

        case "markdownListitem":
          return (
            <div
              key={idx}
              style={{
                marginBottom: "-1rem",
                marginLeft: "1rem",
                marginRight: "1rem",
              }}
            >
              <ReactMarkdown>{item.text}</ReactMarkdown>
            </div>
          );

        case "position":
          return (
            <div key={idx} style={{ marginTop: idx !== 0 ? "3rem" : "0rem" }}>
              <strong>{item.title}</strong> <br />
              <em>
                {item.role} – {item.location}
              </em>{" "}
              <br />
              <small>{item.date}</small>
            </div>
          );

        default:
          return null;
      }
    });
  }

  if (typeof content === "object" && content !== null) {
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

// ---------- Portfolio Section ----------
function PortfolioSection() {
  const projects = [
    {
      title: "Math Fun",
      subtitle: "Math Learning Games",
      icon: "/assets/react.png",
      thumbnail: "/assets/thumb_math.png",
      footer: "View Application - React",
      link: "/portfolio",
    },
    {
      title: "Translation",
      subtitle: "Translation Application",
      icon: "/assets/react.png",
      thumbnail: "/assets/thumb_translator.png",
      footer: "View Application - React",
      link: "https://translate-app-bice-three.vercel.app/",
    },
    {
      title: "Enhanced Search",
      subtitle: "Coperor Console",
      icon: "/assets/xd.png",
      thumbnail: "/assets/thumb_search.png",
      footer: "View Prototype - Adobe XD",
      link: "https://xd.adobe.com/view/afb9a196-0f8f-4fc7-8091-e7390a6582d2-faea/",
    },
    {
      title: "Centralized IFA",
      subtitle: "Coperor Console",
      icon: "/assets/xd.png",
      thumbnail: "/assets/thumb_ifa.png",
      footer: "View Prototype - Adobe XD",
      link: "https://xd.adobe.com/view/ad579ed9-bf28-4d6e-a8ac-06c268f1b1ba-f804/",
    },
    {
      title: "Create Jira Issue",
      subtitle: "Coperor Console",
      icon: "/assets/xd.png",
      thumbnail: "/assets/thumb_jira.png",
      footer: "View Prototype - Adobe XD",
      link: "https://xd.adobe.com/view/1b64d2fe-2e87-4b01-9737-7d559559d5bf-4e37/",
    },
    {
      title: "Skeleton Loader",
      subtitle: "Coperor Console",
      icon: "/assets/xd.png",
      thumbnail: "/assets/thumb_skeleton.png",
      footer: "View Prototype - Adobe XD",
      link: "https://xd.adobe.com/view/84f50ce3-f1f5-464a-b52a-31165d37f377-d1a6/screen/b10d3788-d02c-4607-a07d-cb6a636141d4",
    },
    {
      title: "Match Decision Adjudication",
      subtitle: "Coperor / Salesforce",
      icon: "/assets/xd.png",
      thumbnail: "/assets/thumb_match.png",
      footer: "View Prototype - Adobe XD",
      link: "https://xd.adobe.com/view/a17f0a80-3516-46de-95a8-558002c7753a-f42c/",
    },
    {
      title: "XD Prototype",
      subtitle: "4Spheres Design Process",
      icon: "/assets/xd.png",
      thumbnail: "/assets/thumb_spheres.png",
      footer: "View Prototype - Adobe XD",
      link: "https://xd.adobe.com/view/8319b7e6-69b2-4c9f-908e-6d5d81bef4ff-d64a/",
    },
    {
      title: "Figma Prototype",
      subtitle: "4Spheres Design Process",
      icon: "/assets/figma.svg",
      thumbnail: "/assets/thumb_spheres.png",
      footer: "View Prototype - Figma",
      link: "https://www.figma.com/design/M6wK582bEJt8AKhf1qCzr5/4Spheres?node-id=3-2&p=f",
    },
    {
      title: "Single Page Application",
      subtitle: "4Spheres Design Process",
      icon: "/assets/react.png",
      thumbnail: "/assets/thumb_spheres.png",
      footer: "View Application - React",
      link: "https://kevinmccalley.github.io/4spheres/",
    },
  ];

  return (
    <section id="portfolio" className="scroll-mt-20">
      <h2>
        {iconMap.FaBriefcase} Portfolio
      </h2>
      <div className="portfolio-grid">
        {projects.map((p, idx) => (
          <a
            key={idx}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-item"
          >
            <div className="portfolio-header">
              <div className="portfolio-title">
                <strong>{p.title}</strong>
                <div className="portfolio-subtitle">{p.subtitle}</div>
              </div>
              <img
                src={p.icon}
                alt={`${p.title} icon`}
                className="portfolio-icon"
              />
            </div>
            <img
              src={p.thumbnail}
              alt={p.title}
              className="portfolio-thumbnail"
            />
            <div className="portfolio-footer">{p.footer}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------- SectionContent ----------
function SectionContent({ section }) {
  if (section.id === "portfolio") {
    return <PortfolioSection />;
  }

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

  return (
    <section id={section.id} className="scroll-mt-20">
      <h2>
        {iconMap[section.icon] || null} {section.title}
      </h2>
      {section.subtitle && (
        <h3
          style={{
            fontWeight: "bold",
            marginTop: "0.25rem",
            marginBottom: "1rem",
          }}
        >
          {section.subtitle}
        </h3>
      )}
      <div>
        <RenderContent content={section.content} />
      </div>
    </section>
  );
}

// ---------- Main Component ----------
export default function ReactResume() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

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

  const allSections = [...sections];

  // Updated theme-based button styling with correct dark mode colors
  const themeStyles = {
    dark: {
      backgroundColor: "#D9FEFF",
      color: "#000",
      transition: "background-color 0.2s ease",
    },
    light: { backgroundColor: "#4f46e5", color: "#fff" },
    orange: { backgroundColor: "#FFA500", color: "#000" },
    cherry: { backgroundColor: "#fbb6ce", color: "#000" },
    lime: { backgroundColor: "#a6e22e", color: "#000" },
  };

  const hoverStyles = {
    dark: { backgroundColor: "#8EFBFF" },
    light: { backgroundColor: "#3730a3" },
    orange: { backgroundColor: "#cc8400" },
    cherry: { backgroundColor: "#f497b8" },
    lime: { backgroundColor: "#89cc1e" },
  };

  return (
    <Router>
      <ThemeSelector />

      <div className="app-container">
        <nav className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
          {allSections.map(({ id, title, icon }) => (
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
            {allSections.map(({ id }) => (
              <Route
                key={id}
                path={`/${id}`}
                element={
                  <SectionContent
                    section={allSections.find((s) => s.id === id)}
                  />
                }
              />
            ))}
            <Route path="*" element={<div>Page not found.</div>} />
          </Routes>
        </main>

        {/* ✅ Updated PDF Download Button with correct dark theme colors */}
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <PDFDownloadLink
            document={<ResumePDF />}
            fileName="Kevin_McCalley_Resume.pdf"
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
              cursor: "pointer",
              ...themeStyles[theme],
            }}
            onMouseOver={(e) => {
              Object.assign(e.target.style, hoverStyles[theme]);
            }}
            onMouseOut={(e) => {
              Object.assign(e.target.style, themeStyles[theme]);
            }}
          >
            {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
          </PDFDownloadLink>
        </div>
      </div>
    </Router>
  );
}
