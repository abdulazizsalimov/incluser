import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initGrayscaleHeaderFix } from "./utils/grayscaleHeaderFix";

// Global error handler to catch unhandled JavaScript errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  event.preventDefault(); // Prevent the default error handling
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent the default error handling
});

createRoot(document.getElementById("root")!).render(<App />);

// Initialize grayscale header fix after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initGrayscaleHeaderFix();
  });
} else {
  initGrayscaleHeaderFix();
}
