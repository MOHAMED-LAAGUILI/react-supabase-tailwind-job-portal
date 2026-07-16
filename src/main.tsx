import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { ClerkThemeWrapper } from "./layout/clerk-theme-wrapper";
import { ThemeProvider } from "./layout/theme-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ClerkThemeWrapper>
        <App />
      </ClerkThemeWrapper>
    </ThemeProvider>
  </StrictMode>
);
