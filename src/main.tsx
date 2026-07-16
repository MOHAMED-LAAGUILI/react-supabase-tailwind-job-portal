import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { ClerkThemeWrapper } from "./providers/clerk-theme-wrapper";
import { ThemeProvider } from "./providers/theme-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ClerkThemeWrapper>
        <App />
      </ClerkThemeWrapper>
    </ThemeProvider>
  </StrictMode>
);
