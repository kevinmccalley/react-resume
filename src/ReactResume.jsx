// ReactResume.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  IconContext,
  User,
  ClipboardText,
  Compass,
  Article,
  Code,
  Buildings,
  Briefcase,
  ClockCounterClockwise,
  GraduationCap,
  Target,
  PersonArmsSpread,
  Wrench,
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
  Link,
  useNavigate,
  useLocation,
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
  FaCompass: <Compass />,
  FaFileLines: <Article />,
  FaLaptopCode: <Code />,
  FaBuilding: <Buildings />,
  FaBriefcase: <Briefcase />,
  FaHistory: <ClockCounterClockwise />,
  FaGraduationCap: <GraduationCap />,
  FaBullseye: <Target />,
  FaUniversalAccess: <PersonArmsSpread />,
  FaWrench: <Wrench />,
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
            <h2 className="build-name">{b.name}</h2>
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

        case "caseStudy":
          return <CaseStudy key={idx} steps={item.steps || []} />;

        case "caseFigure":
          return (
            <CaseFigure
              key={idx}
              src={item.src}
              alt={item.alt}
              caption={item.caption}
              logo={item.logo}
              ribbon={item.ribbon}
            />
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
        <div>
          <strong>Résumé</strong>
          <a href="/kevin-mccalley-resume.md" download>
            Plain-text / Markdown version
          </a>
        </div>
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
      <h1>
        <span className="sec-icon">{iconMap[section.icon] || null}</span>
        {section.title}
      </h1>
      {section.subtitle && <h2>{section.subtitle}</h2>}
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

// ---------- Case study ----------
function CaseStudy({ steps }) {
  return (
    <ol className="case-study">
      {steps.map((s, i) => (
        <li key={i} className="case-step">
          <span className="case-label">{s.label}</span>
          <div className="case-body">
            <ReactMarkdown>{s.body}</ReactMarkdown>
          </div>
        </li>
      ))}
    </ol>
  );
}

// The Groundswell wave mark, redrawn from the app's own inline SVG
function GroundswellMark() {
  return (
    <svg width="48" height="48" viewBox="0 0 28 28" fill="none" role="img" aria-label="Groundswell logo">
      <circle cx="14" cy="14" r="14" fill="rgba(14, 165, 233, 0.16)" />
      <path
        d="M4 17 C7 13, 10 20, 14 16 C18 12, 21 19, 24 15"
        stroke="#38bdf8"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 20 C7 16, 10 23, 14 19 C18 15, 21 22, 24 18"
        stroke="#0ea5e9"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

function CaseFigure({ src, alt, caption, logo, ribbon }) {
  return (
    <figure className="case-figure">
      <div className="case-figure-frame">
        <img src={src} alt={alt || ""} loading="lazy" />
        {logo && (
          <span className="case-figure-logo" aria-hidden="true">
            <GroundswellMark />
          </span>
        )}
        {ribbon && (
          <span className="case-figure-ribbon" aria-hidden="true">
            <span>{ribbon}</span>
          </span>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

// ---------- 404 ----------
function NotFound() {
  return (
    <section className="notfound">
      <p className="notfound-code" aria-hidden="true">404</p>
      <h1>This page isn&rsquo;t on the r&eacute;sum&eacute;</h1>
      <p>
        The link you followed points to a section that doesn&rsquo;t exist &mdash; a
        mistyped URL, or something I&rsquo;ve since renamed or removed.
      </p>
      <nav className="notfound-links" aria-label="Suggested pages">
        <Link to="/overview">Overview</Link>
        <Link to="/builds">Selected Product Builds</Link>
        <Link to="/prototypes">Design Prototypes</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </section>
  );
}

// ---------- Keyboard navigation ----------
// "g" then one of these letters jumps to that section.
const SECTION_KEYS = {
  overview: "o",
  highlights: "q",
  "how-i-work": "w",
  builds: "b",
  "case-groundswell": "c",
  experience: "e",
  prototypes: "p",
  history: "h",
  education: "d",
  strengths: "s",
  accessibility: "a",
  uses: "u",
  contact: "t",
  colophon: "l",
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function KeyboardShortcuts({ sections, setHelpOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const gArmed = useRef(false);
  const gTimer = useRef(null);

  useEffect(() => {
    const ids = sections.map((s) => s.id);

    function go(id) {
      if (!id) return;
      navigate("/" + id);
      const main = document.getElementById("main-content");
      if (main) main.focus({ preventScroll: true });
      try {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      } catch (_) {
        /* jsdom / unsupported */
      }
    }

    function onKey(e) {
      const t = e.target;
      const typing =
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable);
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?") {
        e.preventDefault();
        setHelpOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setHelpOpen(false);
        return;
      }

      const cur = ids.indexOf(location.pathname.replace(/^\//, ""));

      if (e.key === "j") {
        e.preventDefault();
        go(ids[Math.min(ids.length - 1, (cur < 0 ? -1 : cur) + 1)]);
        return;
      }
      if (e.key === "k") {
        e.preventDefault();
        go(ids[Math.max(0, (cur < 0 ? 1 : cur) - 1)]);
        return;
      }
      if (e.key === "g") {
        gArmed.current = true;
        clearTimeout(gTimer.current);
        gTimer.current = setTimeout(() => {
          gArmed.current = false;
        }, 1500);
        return;
      }
      if (gArmed.current) {
        gArmed.current = false;
        clearTimeout(gTimer.current);
        const id = Object.keys(SECTION_KEYS).find((k) => SECTION_KEYS[k] === e.key);
        if (id && ids.includes(id)) {
          e.preventDefault();
          go(id);
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(gTimer.current);
    };
  }, [sections, location.pathname, navigate, setHelpOpen]);

  return null;
}

function ShortcutsHelp({ open, onClose, sections }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (open && closeRef.current) closeRef.current.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="kbd-help-backdrop" onClick={onClose}>
      <div
        className="kbd-help"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="kbd-help-head">
          <h2>Keyboard shortcuts</h2>
          <button
            ref={closeRef}
            type="button"
            className="kbd-help-close"
            onClick={onClose}
            aria-label="Close"
          >
            {"×"}
          </button>
        </div>
        <dl className="kbd-list">
          <div>
            <dt>
              <kbd>j</kbd> <kbd>k</kbd>
            </dt>
            <dd>Next / previous section</dd>
          </div>
          <div>
            <dt>
              <kbd>g</kbd> then a letter
            </dt>
            <dd>Jump to a section</dd>
          </div>
          <div>
            <dt>
              <kbd>?</kbd>
            </dt>
            <dd>Toggle this panel</dd>
          </div>
          <div>
            <dt>
              <kbd>Esc</kbd>
            </dt>
            <dd>Close</dd>
          </div>
        </dl>
        <p className="kbd-jump-title">Jump keys</p>
        <ul className="kbd-jumps">
          {sections
            .filter((s) => SECTION_KEYS[s.id])
            .map((s) => (
              <li key={s.id}>
                <kbd>g</kbd> <kbd>{SECTION_KEYS[s.id]}</kbd>
                <span>{s.title}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

// ---------- Main ----------
export default function ReactResume() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

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
      <KeyboardShortcuts sections={sections} setHelpOpen={setHelpOpen} />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} sections={sections} />

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
            <Link to="/overview" className="wordmark" aria-label="Kevin McCalley — home">
              <span>Kevin</span>
              <span>McCalley</span>
            </Link>
            <div className="role">Product Developer and<br />Full Stack Developer</div>
            <div className="where">Portugal · remote, US business hours</div>
          </div>

          <div className="side-nav">
            {sections
              .filter((s) => !s.navHidden)
              .map(({ id, title, icon }) => (
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
            <button type="button" className="kbd-hint" onClick={() => setHelpOpen(true)}>
              <span aria-hidden="true">⌨</span> Keyboard shortcuts <kbd>?</kbd>
            </button>
            <Link to="/colophon" className="foot-link" onClick={closeMenu}>
              Colophon
            </Link>
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
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* fixed-position, but kept inside <main> so it lives within a landmark */}
          <PDFDownloadLink
            document={<ResumePDF />}
            fileName="Kevin_McCalley_Resume.pdf"
            className="pdf-download"
          >
            {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
          </PDFDownloadLink>
        </main>
      </div>
    </Router>
    </IconContext.Provider>
  );
}
