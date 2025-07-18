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
  // FaArrowLeft,  // Removed because close button is removed
} from "react-icons/fa";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import ThemeSelector from "./ThemeSelector";
import "./ReactResume.css";

const sections = [
  {
    id: "overview",
    title: "Overview",
    icon: <FaFilter className="text-xl" />,
    content: `Insightful, experienced website and web application developer and technical writer with a B.A. and a proclivity for managing and conveying compelling digital content. Knowledgeable IT professional with a proven ability to generate successful results through effective use of cutting-edge technology, meticulous usability testing, and user interface design optimization. Astute individual skilled at determining technical standards, coding protocols, tools, and platforms. Strong background planning, designing, developing, and testing websites. Highly skilled at creative design and development using single-page web application frameworks and content management systems.`,
  },
  {
    id: "highlights",
    title: "Qualifications",
    icon: <FaGavel className="text-xl" />,
    content: (
      <>
        <p>
          <strong>Technical Writing:</strong> Over six years' experience with
          technical writing and editing for various projects such as
          instructions, manuals, website content, API Endpoint documentation and
          multimedia presentations.
        </p>
        <p>
          <strong>Communication:</strong> Articulate communicator adept at
          developing and delivering training and technical demonstrations.
          Consistent success contributing to cross-functional teams and
          exhibiting efficiency, quality, and flexibility managing and
          prioritizing project components.
        </p>
        <p>
          <strong>Technology Tools:</strong>
        </p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Graphic Design and Prototyping:</strong> Adobe Creative
            Suite (XD, Photoshop, Illustrator), Figma, Lunacy
          </li>
          <li>
            <strong>Programming:</strong> TypeScript, ES6 Javascript, php, asp,
            aspx, and html scripting; JSON and xml data-structuring; and
            css/scss style sheets
          </li>
          <li>
            <strong>Scripting Libraries:</strong> Angular, React, jQuery
          </li>
          <li>
            <strong>Development:</strong> Visual Studio, Visual Studio Code,
            Node Package Manager
          </li>
          <li>
            <strong>Platforms:</strong> Windows, Linux
          </li>
          <li>
            <strong>Documentation:</strong> Confluence, Postman, draw.io
          </li>
          <li>
            <strong>System Management:</strong> Terminal (CLI), Windows
            PowerShell, RDC virtual machines, remote management
          </li>
          <li>
            <strong>Agile:</strong> Jira
          </li>
        </ul>
      </>
    ),
  },
{
  id: "experience",
  title: "Professional Experience",
  icon: <FaBuilding className="text-xl" />,
  content: (
    <>
      <p><strong>November 2022 – April 2025: 365 Retail Markets / FullCount</strong><br />
      <em>Senior UI/UX Designer and Developer – San Luis Obispo, CA (Remote)</em><br />
      Sole designer embedded in a React development team, creating touchscreen and support applications for senior living centers.<br />
      Prototyped accessible interfaces in Figma and implemented them using React and Material UI.<br />
      Prioritized usability and accessibility across devices, ensuring compliance with best practices.<br />
      Researched image optimization methods and authored internal documentation and user guides.<br />
      Contributed front-end code with a focus on consistency, responsiveness, and accessibility.
      </p>

      <p><strong>April 2020 – January 2022: Gaine Solutions</strong><br />
      <em>Web Application Development / UI Design / Technical Writing – San Luis Obispo, CA</em><br />
      Led UI design and development for Angular/TypeScript web applications serving enterprise clients.<br />
      Designed and built the Coperor Console and other tools for managing metadata and data governance.<br />
      Created XD-based prototypes and guided implementation of reusable components.<br />
      Collaborated on Agile teams to meet accessibility and UX goals.<br />
      Honored as Employee of the Month for cross-functional leadership and delivery.
      </p>
    </>
  )
},
{
  id: "history",
  title: "Earlier Career History",
  icon: <FaHistory className="text-xl" />,
  content: (
    <>
      <p><strong>2008 – 2020: Independent Consultant</strong><br />
      <em>Website and Application Development – Central Coast / Southern CA</em><br />
      Designed and developed websites and branding materials for clients including PSSC Labs, Ribbon, Artizen HPC, and others.</p>

      <p><strong>2008: First American Title</strong><br />
      <em>Website Developer – Santa Ana, CA</em><br />
      Developed and maintained the “eTree” website for First American Document Solutions using HTML, CSS, JavaScript, and ASP.</p>

      <p><strong>2002 – 2007: Bear Stearns / Encore Credit</strong><br />
      <em>Website Developer & Technical Writer – Irvine, CA</em><br />
      Built corporate intranet and external websites, and authored technical documentation and marketing materials.</p>
    </>
  )
},

  {
    id: "education",
    title: "Education",
    icon: <FaSchool className="text-xl" />,
    content: `1994: Bachelor of Arts, English\nUniversity of California, Berkeley\nBerkeley, CA`,
  },
  {
    id: "strengths",
    title: "Key Strengths",
    icon: <FaBullseye className="text-xl" />,
    content: `Website Design Development, Website Development, User Interface Design, Graphic Design, Web Programming, Application Development, Content Management, Single-Page Web Applications, Prototyping, UI/UX Design, Web Accessibility, Debugging, Technical Writing, Marketing Strategy, Agile Scrum Team Planning`,
  },
  {
    id: "accessibility",
    title: "Accessibility",
    icon: <FaUniversalAccess className="text-xl" />,
    content: `I am committed to building applications that meet WAI WCAG guidelines, Section 508 standards for accessibility on government and/or federally-funded applications, and in compliance with the Americans with Disabilities Act (ADA).`,
  },
  {
    id: "contact",
    title: "Contact",
    icon: <FaAddressCard className="text-xl" />,
    content: (
    <div className="contact-content">
      <div><strong>Email:</strong> kevinmccalley@proton.me</div>
      <div><strong>LinkedIn:</strong> kevin-mccalley</div>
    </div>
  ),
  },
];

function SectionContent({ id }) {
  const section = sections.find((s) => s.id === id);
  if (!section) return <div>Section not found.</div>;
  return (
    <section id={section.id} className="scroll-mt-20">
      <h2>
        {section.icon} {section.title}
      </h2>
      <div>{section.content}</div>
    </section>
  );
}

export default function ReactResume() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <ThemeSelector />
      <div className="app-container">
        <nav className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
          {/* Close button removed */}

          {sections.map(({ id, title, icon }) => (
            <NavLink
              key={id}
              to={`/${id}`}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "active-menu-item" : undefined
              }
            >
              <span className="menu-icon">{icon}</span>
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
                element={<SectionContent id={id} />}
              />
            ))}
            <Route path="*" element={<div>Page not found.</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
