import React from "react";
import ReactDOM from "react-dom/client";
import ReactResume from "./ReactResume";
import { ThemeProvider } from "./ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ReactResume />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
