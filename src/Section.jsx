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

function createIconFactory(icons = iconComponents) {
  return function getIcon(iconName) {
    const IconComponent = icons[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="text-xl" />;
  };
}

const getIcon = createIconFactory();

function RenderStringContent({ content }) {
  return <p>{content}</p>;
}

function RenderPositionItem({ item, idx }) {
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
}

function RenderArrayItem({ item, idx }) {
  switch (item.type) {
    case "position":
      return <RenderPositionItem item={item} idx={idx} />;
    default:
      return null;
  }
}

function RenderArrayContent({ content }) {
  return content.map((item, idx) => (
    <RenderArrayItem key={idx} item={item} idx={idx} />
  ));
}

function RenderObjectContent({ content }) {
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

function RenderContent({ content }) {
  if (!content) return null;

  if (typeof content === "string") {
    return <RenderStringContent content={content} />;
  }

  if (Array.isArray(content)) {
    return <RenderArrayContent content={content} />;
  }

  if (typeof content === "object" && content !== null) {
    return <RenderObjectContent content={content} />;
  }

  return null;
}

function SectionLayout({
  id,
  icon,
  title,
  subtitle,
  content,
  icons = getIcon,
  children,
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="flex items-center gap-2">
        {icons(icon) || null} {title}
      </h2>
      {subtitle && (
        <h3 className="text-lg font-semibold mt-1 mb-3" style={{ opacity: 0.9 }}>
          {subtitle}
        </h3>
      )}
      <div>
        {children}
        <RenderContent content={content} />
      </div>
    </section>
  );
}

function ContactSection({ section, icons, FormComponent }) {
  return (
    <SectionLayout
      id={section.id}
      icon={section.icon}
      title={section.title}
      subtitle={section.subtitle}
      content={section.content}
      icons={icons}
    >
      <div style={{ marginTop: "1rem" }}>
        <FormComponent />
        <div style={{ marginTop: "2rem" }} />
      </div>
    </SectionLayout>
  );
}

export default function Section({ section, icons = getIcon, FormComponent }) {
  if (!section) return null;

  if (section.id === "contact") {
    return <ContactSection section={section} icons={icons} FormComponent={FormComponent} />;
  }

  return (
    <SectionLayout
      id={section.id}
      icon={section.icon}
      title={section.title}
      subtitle={section.subtitle}
      content={section.content}
      icons={icons}
    />
  );
}