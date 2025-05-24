import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "./lib/queryClient.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="vite-ui-theme"
      >
        <div className="min-h-screen bg-background text-foreground">
          <App />
        </div>

        <Toaster position="top-right" reverseOrder={false} />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
