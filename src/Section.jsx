import React from "react";
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
import RenderPositionContent from "./RenderPositionContent";
import RenderEmailContent from "./RenderEmailContent";
import RenderLinkedinContent from "./RenderLinkedinContent";
import "./section.css";

export const DEFAULT_ICON_MAP = {
  FaFilter: <FaFilter className="text-xl" />,
  FaGavel: <FaGavel className="text-xl" />,
  FaBuilding: <FaBuilding className="text-xl" />,
  FaHistory: <FaHistory className="text-xl" />,
  FaSchool: <FaSchool className="text-xl" />,
  FaBullseye: <FaBullseye className="text-xl" />,
  FaUniversalAccess: <FaUniversalAccess className="text-xl" />,
  FaAddressCard: <FaAddressCard className="text-xl" />,
};

function RenderContent({ content }) {
  if (!content) return null;

  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <RenderContentItem key={index} item={item} />
    ));
  }

  return <RenderContentItem item={content} />;
}

function RenderContentItem({ item }) {
  if (!item) return null;

  if (item.position) {
    return <RenderPositionContent item={item} />;
  }

  if (item.email) {
    return <RenderEmailContent item={item} />;
  }

  if (item.linkedin) {
    return <RenderLinkedinContent item={item} />;
  }

  return null;
}

function ContactSection({ section, iconMap }) {
  return (
    <section id={section.id} className="scroll-mt-20">
      <h2 className="flex items-center gap-2">
        {iconMap[section.icon] || null} {section.title}
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

function DefaultSection({ section, iconMap }) {
  return (
    <section id={section.id} className="scroll-mt-20">
      <h2 className="flex items-center gap-2">
        {iconMap[section.icon] || null} {section.title}
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

export default function Section({ section, iconMap = DEFAULT_ICON_MAP }) {
  if (!section) return null;

  if (section.id === "contact") {
    return <ContactSection section={section} iconMap={iconMap} />;
  }

  return <DefaultSection section={section} iconMap={iconMap} />;
}