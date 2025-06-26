import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./errorBoundary";
import "./index.css";

// Disable the runtime error overlay
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    event.stopImmediatePropagation();
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    event.stopImmediatePropagation();
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
