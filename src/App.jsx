import React from "react";
import { FaFilter, FaGavel, FaBuilding, FaHistory, FaSchool, FaBullseye, FaUniversalAccess, FaAddressCard } from "react-icons/fa";

const sections = [
  { id: "summary", icon: <FaAddressCard />, label: "Summary" },
  { id: "skills", icon: <FaFilter />, label: "Skills" },
  { id: "experience", icon: <FaBuilding />, label: "Experience" },
  { id: "education", icon: <FaSchool />, label: "Education" },
  { id: "volunteer", icon: <FaUniversalAccess />, label: "Volunteer" },
  { id: "projects", icon: <FaBullseye />, label: "Projects" },
  { id: "awards", icon: <FaGavel />, label: "Awards" },
  { id: "history", icon: <FaHistory />, label: "History" }
];

const App = () => {
  return (
    <div className="font-sans text-gray-900 bg-gray-100">
      <header className="sticky top-0 z-50 bg-white shadow-md flex justify-around p-4">
        {sections.map(({ id, icon, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className="flex flex-col items-center text-sm hover:text-blue-500 transition"
          >
            <div className="text-xl">{icon}</div>
            {label}
          </a>
        ))}
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-16">
        {sections.map(({ id, label }) => (
          <section key={id} id={id} className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-2">{label}</h2>
            <p className="text-gray-700">[Add content for {label} here]</p>
          </section>
        ))}
      </main>
    </div>
  );
};

export default App;