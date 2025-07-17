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
import ThemeSelector from './ThemeSelector';
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
    content: `November 2022 - April 2025: 365 Retail Markets / FullCount\nSenior UI/UX Designer and Developer\nSan Luis Obispo, CA\nWorked remotely on touchscreen applications for senior living centers with a team of developers based in Iowa.\nCreated wireframes and designed prototypes for new features and enhancements.\nDeveloped javascript and front end code in React and worked to ensure that the designs were implemented to the specifications.\nEnsured that the designs delivered and the code written was accessible and easy for all users.\n\nApr 2020 - Jan 2022: Gaine Solutions\nWeb Application Development / User Interface / Technical Writing\nSan Luis Obispo, CA\nDeveloped web applications using Angular/typescript.\nCreated XD prototypes for new additions to the web product as primary graphic designer for the user interface layout of the Coperor Console.\nDeveloped various applications including the Coperor Console, Gaine Centralized IFA Issue Tracking Application, Metadata Repository, and the Symphony Provider Registry.\nComposed and created application-specific technical documents.\nResearched, evaluated and implemented web accessibility best practices.\nWorked closely with the Product Manager to conceive and develop prototypes for user interface designs to extend the product suite.\nApplied Agile Scrum methodology for team and project planning.\nGaine employee of the month for October 2021.`,
  },
  {
    id: "history",
    title: "Earlier Career History",
    icon: <FaHistory className="text-xl" />,
    content: `2008 - 2020: Independent Consultant, Website and Application Development\nCentral Coast, CA/Southern CA\nDeveloped and maintained websites for a range of clients including, but not limited to, PSSC Labs, Artizen HPC, Brandon Mulloy, Ribbon, Innovative Learning, Project Optimal, Penn Air Group, and eatalbacore.com.\n\n2008: First American Title\nWebsite Developer\nSanta Ana, CA\nCollaborated with the First American Document Solutions team to develop and test the “eTree” website.\nWrote and published the website html, css, javascript, and asp.\n\n2002 - 2007: Bear Stearns/Encore Credit\nWebsite Developer/Technical Writer\nIrvine, CA\nDeveloped and managed the company website and corporate intranet.\nPerformed technical writing and editing as well as marketing copywriting.`,
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
    content: `Email: kevinmccalley@proton.me\nLinkedIn: kevin-mccalley`,
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
              <span className="menu-text">{title}</span>
              <span className="menu-icon">{icon}</span>
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
