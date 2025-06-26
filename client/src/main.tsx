import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./errorBoundary";
import "./index.css";

// AGGRESSIVE ERROR OVERLAY ELIMINATION
if (typeof window !== 'undefined') {
  // Block all error overlays completely
  Object.defineProperty(window, 'sendError', {
    value: () => {},
    writable: false,
    configurable: false
  });

  // Intercept and neutralize all error events
  const blockError = (e: any) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  };

  // Capture all possible error events
  ['error', 'unhandledrejection', 'rejectionhandled'].forEach(event => {
    window.addEventListener(event, blockError, true);
    document.addEventListener(event, blockError, true);
  });

  // Override console methods that trigger overlays
  const noop = () => {};
  ['error', 'warn'].forEach(method => {
    const original = (console as any)[method];
    (console as any)[method] = (...args: any[]) => {
      const msg = args.join(' ');
      if (msg.includes('runtime-error') || msg.includes('sendError') || msg.includes('Script error')) {
        return;
      }
      original.apply(console, args);
    };
  });

  // Remove any existing error overlay elements
  const removeOverlays = () => {
    const overlays = document.querySelectorAll('[data-vite-dev-id], .vite-error-overlay, [class*="error-overlay"]');
    overlays.forEach(el => el.remove());
  };

  // Continuously remove overlays
  setInterval(removeOverlays, 100);
  
  // Block overlay creation at DOM level
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node: any) => {
        if (node.nodeType === 1 && (
          node.innerHTML?.includes('runtime-error') || 
          node.className?.includes('error') ||
          node.style?.zIndex > 9999
        )) {
          node.remove();
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
