import React from "react";
import ReactDOM from "react-dom/client";
import ReactResume from "./ReactResume";
import { ThemeProvider } from "./ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
};

const queryClient = createQueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <div>
            <ReactResume />
          </div>  
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
);