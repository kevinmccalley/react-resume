import React from "react";
import ReactMarkdown from "react-markdown";
import {
  FaFilter,
  FaGavel,
  FaBuilding,
  FaHistory,
  FaSchool,
  FaBullseye,
  FaUniversalAccess,
  FaAddressCard,
} from "react-icons/fa";
import ContactForm from "./ContactForm";
import "./section.css";

const iconComponents = {
  FaFilter,
  FaGavel,
  FaBuilding,
  FaHistory,
  FaSchool,
  FaBullseye,
  FaUniversalAccess,
  FaAddressCard,
};

function getIcon(iconName) {
  const IconComponent = iconComponents[iconName];
  if (!IconComponent) return null;
  return <IconComponent className="text-xl" />;
}

function RenderContent({ content }) {
  if (!content) return null;

  if (typeof content === "string") return <p>{content}</p>;

  if (Array.isArray(content)) {
    return content.map((item, idx) => {
      switch (item.type) {
        case "position":
          return (
            <div key={idx} className="job-position mb-4">
              <p>
                <strong>{item.title}</strong> <br />
                <em>
                  {item.role} – {item.location}
                </em>
                <br />
                <small>{item.date}</small>
              </p>
              {item.bullets.map((b, bIdx) => (
                <div key={bIdx} className="markdown-bullet">
                  <ReactMarkdown>{b}</ReactMarkdown>
                </div>
              ))}
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
          <p>
            <strong>Email:</strong> {content.email}
          </p>
        )}
        {content.linkedin && (
          <p>
            <strong>LinkedIn:</strong> {content.linkedin}
          </p>
        )}
      </div>
    );
  }

  return null;
}

export default function Section({ section, icons = getIcon }) {
  if (!section) return null;

  if (section.id === "contact") {
    return (
      <section id={section.id} className="scroll-mt-20">
        <h2 className="flex items-center gap-2">
          {icons(section.icon) || null} {section.title}
        </h2>
        <div style={{ marginTop: "1rem" }}>
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
      <h2 className="flex items-center gap-2">
        {icons(section.icon) || null} {section.title}
      </h2>
      {section.subtitle && (
        <h3 className="text-lg font-semibold mt-1 mb-3" style={{ opacity: 0.9 }}>
          {section.subtitle}
        </h3>
      )}
      <div>
        <RenderContent content={section.content} />
      </div>
    </section>
  );
}