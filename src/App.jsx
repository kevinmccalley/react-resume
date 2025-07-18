import React, { useEffect, useState, Suspense, lazy } from "react";
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

const iconMap = {
  summary: <FaAddressCard />,
  skills: <FaFilter />,
  experience: <FaBuilding />,
  education: <FaSchool />,
  volunteer: <FaUniversalAccess />,
  projects: <FaBullseye />,
  awards: <FaGavel />,
  history: <FaHistory />,
};

const App = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch("/sections.json")
      .then((res) => res.json())
      .then((data) => setSections(data))
      .catch((err) => console.error("Error loading sections.json:", err));
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-gray-100 min-h-screen">
      <header className="sticky top-0 z-50 bg-white shadow-md flex justify-around p-4">
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className="flex flex-col items-center text-sm hover:text-blue-500 transition"
          >
            <div className="text-xl">{iconMap[id]}</div>
            {label}
          </a>
        ))}
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-16">
        {sections.map(({ id, label }) => {
          const SectionComponent = lazy(() =>
            import(`./sections/${capitalizeFirst(id)}.jsx`)
          );
          return (
            <section key={id} id={id} className="scroll-mt-24">
              <Suspense fallback={<p>Loading {label}...</p>}>
                <SectionComponent />
              </Suspense>
            </section>
          );
        })}
      </main>
    </div>
  );
};

const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default App;
