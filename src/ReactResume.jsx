// ReactResume.jsx
import React, { useState } from "react";
import {
  FaUser,
  FaClipboardList,
  FaLaptopCode,
  FaBuilding,
  FaBriefcase,
  FaHistory,
  FaGraduationCap,
  FaBullseye,
  FaUniversalAccess,
  FaEnvelope,
  FaBars,
  FaArrowRight,
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
import { useQuery } from "@tanstack/react-query";
import ThemeSelector from "./ThemeSelector";
import ContactForm from "./ContactForm";
import ResumePDF from "./ResumePDF";
import SkipLink from "./SkipLink";
import "./ReactResume.css";

// Map icon names from sections.json to components
const iconMap = {
  FaUser: <FaUser />,
  FaClipboardList: <FaClipboardList />,
  FaLaptopCode: <FaLaptopCode />,
  FaBuilding: <FaBuilding />,
  FaBriefcase: <FaBriefcase />,
  FaHistory: <FaHistory />,
  FaGraduationCap: <FaGraduationCap />,
  FaBullseye: <FaBullseye />,
  FaUniversalAccess: <FaUniversalAccess />,
  FaEnvelope: <FaEnvelope />,
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
                  {b.linkLabel || "Visit"} <FaArrowRight aria-hidden="true" />
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

// ---------- Portfolio (prototypes & demos) ----------
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
    title: "Acrylic Mix Lab",
    subtitle: "Paint Mixer",
    icon: "/assets/react.png",
    thumbnail: "/assets/thumb_mixlab.png",
    footer: "View Application - React",
    link: "https://paint-mixer.vercel.app/",
  },
  {
    title: "Math Fun",
    subtitle: "Math Learning Games",
    icon: "/assets/react.png",
    thumbnail: "/assets/thumb_math.png",
    footer: "View Application - React",
    link: "https://times-table-kvv9kc70x-kevin-mccalleys-projects.vercel.app/",
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
    <Router>
      <SkipLink />

      <div className="app-container">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <FaBars size={20} />
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
  );
}
