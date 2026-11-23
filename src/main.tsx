import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ProgressProvider } from "./state/progress";
import "./index.css";
import "./product.css";
import "./learn.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </StrictMode>,
);
