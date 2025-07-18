import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "../ThemeContext";
import "../ReactResume.css";

const ThemeSelector = ({ onClose }) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "light", color: "#ffffff", border: "1px solid #000" },
    { name: "dark", color: "#000000" },
    { name: "orange", color: "#f97316" },
    { name: "lime", color: "#84cc16" },
    { name: "cherry", color: "#f9a8d4" },
  ];

  return (
    <div className="theme-selector">
      <div className="theme-title">Theme</div>
      <div className="theme-options">
        {themes.map((t) => (
          <div
            key={t.name}
            className={`theme-circle ${theme === t.name ? "selected" : ""}`}
            style={{
              backgroundColor: t.color,
              border: t.border || "none",
            }}
            onClick={() => {
              setTheme(t.name);
              if (onClose) onClose();
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Header = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <IconButton
        onClick={toggleMenu}
        aria-label="Open menu"
        className="icon-button"
      >
        <MenuIcon />
      </IconButton>

      {/* Navigation Drawer */}
      <nav className={`sidebar ${menuOpen ? "open" : ""}`}>
        {/* Left Arrow: Only visible on mobile */}
        <button
          className="back-button"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <MdArrowBack />
        </button>

        {/* Nav Items */}
        <ul className="nav-links">
          <li onClick={closeMenu}>About</li>
          <li onClick={closeMenu}>Projects</li>
          <li onClick={closeMenu}>Contact</li>
        </ul>

        {/* Theme Selector */}
        <ThemeSelector onClose={closeMenu} />
      </nav>

      {/* Overlay when menu is open */}
      {menuOpen && <div className="overlay" onClick={closeMenu} />}
    </header>
  );
};

export default Header;
