import React from "react";
import ReactDOM from "react-dom/client";
import ReactResume from "./ReactResume";
import { ThemeProvider } from "./ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ReactResume />
    </ThemeProvider>
  </React.StrictMode>
);
