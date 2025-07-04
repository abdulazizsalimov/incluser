// Fix for header disappearing in grayscale mode
export function initGrayscaleHeaderFix() {
  let grayscaleHeader: HTMLElement | null = null;
  let originalHeader: HTMLElement | null = null;

  function createGrayscaleHeader() {
    if (grayscaleHeader) return;
    
    originalHeader = document.querySelector('header[role="banner"]');
    if (!originalHeader) return;

    // Clone the header
    grayscaleHeader = originalHeader.cloneNode(true) as HTMLElement;
    
    // Style the cloned header to be completely isolated
    grayscaleHeader.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      height: 80px !important;
      z-index: 99999 !important;
      filter: none !important;
      isolation: isolate !important;
      background: white !important;
      border-bottom: 1px solid #e2e8f0 !important;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
      pointer-events: auto !important;
    `;
    
    // Add to document root to escape all filters
    document.documentElement.appendChild(grayscaleHeader);
    
    // Re-attach event listeners to cloned elements
    attachEventListeners(grayscaleHeader);
    
    // Hide original header
    if (originalHeader) {
      originalHeader.style.display = 'none';
    }
  }

  function removeGrayscaleHeader() {
    if (grayscaleHeader) {
      grayscaleHeader.remove();
      grayscaleHeader = null;
    }
    
    // Show original header
    if (originalHeader) {
      originalHeader.style.display = '';
    }
  }

  function attachEventListeners(header: HTMLElement) {
    // Re-attach click handlers for buttons
    const accessibilityBtn = header.querySelector('[aria-label="Специальные возможности"]');
    if (accessibilityBtn) {
      accessibilityBtn.addEventListener('click', () => {
        // Trigger accessibility panel open
        const event = new CustomEvent('accessibility-toggle');
        window.dispatchEvent(event);
      });
    }

    const adminBtn = header.querySelector('button:has-text("Админ-панель")') || 
                    header.querySelector('button[onclick*="admin"]') ||
                    Array.from(header.querySelectorAll('button')).find(btn => btn.textContent?.includes('Админ'));
    if (adminBtn) {
      adminBtn.addEventListener('click', () => {
        window.location.href = '/admin';
      });
    }

    const logoutBtn = header.querySelector('button:has-text("Выход")') || 
                     Array.from(header.querySelectorAll('button')).find(btn => btn.textContent?.includes('Выход'));
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          await fetch("/api/logout", { method: "POST" });
          window.location.href = "/";
        } catch (error) {
          window.location.href = "/";
        }
      });
    }

    // Re-attach navigation links
    const navLinks = header.querySelectorAll('a[href]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (link as HTMLAnchorElement).getAttribute('href');
        if (href) {
          window.location.href = href;
        }
      });
    });
  }

  // Observe body class changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const hasGrayscale = document.body.classList.contains('grayscale-mode');
        
        if (hasGrayscale && !grayscaleHeader) {
          createGrayscaleHeader();
        } else if (!hasGrayscale && grayscaleHeader) {
          removeGrayscaleHeader();
        }
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Initial check
  if (document.body.classList.contains('grayscale-mode')) {
    createGrayscaleHeader();
  }

  return () => {
    observer.disconnect();
    removeGrayscaleHeader();
  };
}