// ReactResume.jsx
import React, { useState } from "react";
import {
  IconContext,
  User,
  ClipboardText,
  Code,
  Buildings,
  Briefcase,
  ClockCounterClockwise,
  GraduationCap,
  Target,
  PersonArmsSpread,
  Envelope,
  List,
  ArrowRight,
} from "@phosphor-icons/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import ThemeSelector from "./ThemeSelector";
import ContactForm from "./ContactForm";
import ResumePDF from "./ResumePDF";
import SkipLink from "./SkipLink";
import "./ReactResume.css";

// Map icon names from sections.json to components.
// Names are kept Fa-prefixed for back-compat with sections.json; the glyphs are Phosphor.
const iconMap = {
  FaUser: <User />,
  FaClipboardList: <ClipboardText />,
  FaLaptopCode: <Code />,
  FaBuilding: <Buildings />,
  FaBriefcase: <Briefcase />,
  FaHistory: <ClockCounterClockwise />,
  FaGraduationCap: <GraduationCap />,
  FaBullseye: <Target />,
  FaUniversalAccess: <PersonArmsSpread />,
  FaEnvelope: <Envelope />,
};

function initialsOf(name) {
  return name
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Za-z0-9]/g, "")[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ---------- Build media (screenshot with graceful placeholder) ----------
function BuildMedia({ image, name }) {
  const [failed, setFailed] = useState(false);
  if (!image || failed) {
    return (
      <div className="build-media is-placeholder" aria-hidden="true">
        {initialsOf(name)}
      </div>
    );
  }
  return (
    <div className="build-media">
      <img src={image} alt={`${name} screenshot`} loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}

// ---------- Product builds ----------
function BuildGrid({ items }) {
  return (
    <div className="build-grid">
      {items.map((b) => (
        <article key={b.name} className="build-card">
          <BuildMedia image={b.image} name={b.name} />
          <div className="build-body">
            <h3 className="build-name">{b.name}</h3>
            <p className="build-tagline">{b.tagline}</p>
            <p className="build-desc">{b.description}</p>
            {b.stack && b.stack.length > 0 && (
              <div className="build-stack">
                {b.stack.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            )}
            <div className="build-meta">
              {b.scope && <span className="build-scope">{b.scope}</span>}
              {b.link ? (
                <a className="build-link" href={b.link} target="_blank" rel="noopener noreferrer">
                  {b.linkLabel || "Visit"} <ArrowRight aria-hidden="true" />
                </a>
              ) : (
                <span className="build-link is-inactive">{b.linkLabel}</span>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// ---------- Design Prototypes ----------
const portfolioProjects = [
  {
    title: "Keyboard User Interface",
    subtitle: "Figma Prototype",
    icon: "/assets/figma.svg",
    thumbnail: "/assets/thumb_keyboard.png",
    footer: "View Prototype - Figma",
    link: "https://www.figma.com/community/file/1563421262526349742",
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
];

function PortfolioGrid() {
  return (
    <div className="portfolio-grid">
      {portfolioProjects.map((p, idx) => (
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
            <img src={p.icon} alt="" className="portfolio-icon" />
          </div>
          <img src={p.thumbnail} alt={p.title} className="portfolio-thumbnail" loading="lazy" />
          <div className="portfolio-footer">{p.footer}</div>
        </a>
      ))}
    </div>
  );
}

// ---------- Content renderer ----------
function RenderContent({ content }) {
  if (typeof content === "string") return <p>{content}</p>;

  if (Array.isArray(content)) {
    return content.map((item, idx) => {
      switch (item.type) {
        case "paragraph":
          return <p key={idx}>{item.text}</p>;

        case "markdown":
          return <ReactMarkdown key={idx}>{item.text}</ReactMarkdown>;

        case "markdownListitem":
          return (
            <div key={idx} className="md-list-item">
              <ReactMarkdown>{item.text.replace(/^•\s*/, "")}</ReactMarkdown>
            </div>
          );

        case "position":
          return (
            <div key={idx} className="position">
              <div className="pos-title">{item.title}</div>
              <div className="pos-meta">
                {item.role} · {item.location}
              </div>
              <div className="pos-date">{item.date}</div>
            </div>
          );

        case "buildGrid":
          return <BuildGrid key={idx} items={item.items || []} />;

        case "portfolioGrid":
          return <PortfolioGrid key={idx} />;

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
            <strong>Email</strong>
            <a href={`mailto:${content.email}`}>{content.email}</a>
          </div>
        )}
        {content.linkedin && (
          <div>
            <strong>LinkedIn</strong>
            <a
              href={`https://www.linkedin.com/in/${content.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.linkedin}
            </a>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ---------- Section ----------
function SectionContent({ section }) {
  if (!section) return null;

  return (
    <section id={section.id}>
      <h2>
        <span className="sec-icon">{iconMap[section.icon] || null}</span>
        {section.title}
      </h2>
      {section.subtitle && <h3>{section.subtitle}</h3>}
      {section.id === "contact" ? (
        <div>
          <ContactForm />
          <RenderContent content={section.content} />
        </div>
      ) : (
        <div>
          <RenderContent content={section.content} />
        </div>
      )}
    </section>
  );
}

// ---------- Main ----------
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

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <IconContext.Provider value={{ weight: "duotone", size: "1em" }}>
    <Router>
      <SkipLink />

      <div className="app-container">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <List size={20} />
        </button>

        <nav className={`sidebar ${mobileMenuOpen ? "open" : ""}`} aria-label="Sections">
          <div className="identity">
            <img className="avatar" src="/assets/avatar.jpg" alt="Kevin McCalley" width="52" height="52" />
            <div className="who">Kevin McCalley</div>
            <div className="role">Senior Front-End Engineer &amp; UI/UX Designer</div>
            <div className="where">Remote · United States</div>
          </div>

          <div className="side-nav">
            {sections.map(({ id, title, icon }) => (
              <NavLink
                key={id}
                to={`/${id}`}
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? "active-menu-item" : undefined)}
              >
                <span className="menu-icon">{iconMap[icon]}</span>
                <span className="menu-text">{title}</span>
              </NavLink>
            ))}
          </div>

          <div className="sidebar-footer">
            <span className="foot-label">Theme</span>
            <ThemeSelector />
          </div>
        </nav>

        <div
          className="nav-overlay"
          onClick={closeMenu}
          hidden={!mobileMenuOpen}
        />

        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            {sections.map((s) => (
              <Route key={s.id} path={`/${s.id}`} element={<SectionContent section={s} />} />
            ))}
            <Route path="*" element={<div>Page not found.</div>} />
          </Routes>
        </main>

        <PDFDownloadLink
          document={<ResumePDF />}
          fileName="Kevin_McCalley_Resume.pdf"
          className="pdf-download"
        >
          {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
        </PDFDownloadLink>
      </div>
    </Router>
    </IconContext.Provider>
  );
}
