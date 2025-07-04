// Fix for header disappearing in grayscale mode
export function initGrayscaleHeaderFix() {
  console.log('Initializing grayscale header fix');
  let grayscaleHeader: HTMLElement | null = null;
  let originalHeader: HTMLElement | null = null;

  function createGrayscaleHeader() {
    if (grayscaleHeader) return;
    
    originalHeader = document.querySelector('header[role="banner"]');
    if (!originalHeader) return;

    console.log('Creating grayscale header clone');
    
    // Clone the header with all children and event handlers
    grayscaleHeader = originalHeader.cloneNode(true) as HTMLElement;
    
    // Copy all computed styles from original header to maintain exact appearance
    const originalStyles = window.getComputedStyle(originalHeader);
    
    // Style the cloned header to be completely isolated and match original
    grayscaleHeader.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      height: ${originalStyles.height} !important;
      z-index: 99999 !important;
      filter: none !important;
      isolation: isolate !important;
      background: ${originalStyles.background} !important;
      background-color: ${originalStyles.backgroundColor} !important;
      border: ${originalStyles.border} !important;
      border-bottom: ${originalStyles.borderBottom} !important;
      box-shadow: ${originalStyles.boxShadow} !important;
      padding: ${originalStyles.padding} !important;
      margin: 0 !important;
      pointer-events: auto !important;
      font-family: ${originalStyles.fontFamily} !important;
      font-size: ${originalStyles.fontSize} !important;
      color: ${originalStyles.color} !important;
    `;
    
    // Ensure all child elements maintain their styles
    const allElements = grayscaleHeader.querySelectorAll('*');
    allElements.forEach((element, index) => {
      const originalElement = originalHeader.querySelectorAll('*')[index];
      if (originalElement) {
        const elementStyles = window.getComputedStyle(originalElement);
        (element as HTMLElement).style.cssText += `
          color: ${elementStyles.color} !important;
          background-color: ${elementStyles.backgroundColor} !important;
          border: ${elementStyles.border} !important;
          font-size: ${elementStyles.fontSize} !important;
          font-weight: ${elementStyles.fontWeight} !important;
        `;
      }
    });
    
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
    const buttons = header.querySelectorAll('button');
    buttons.forEach(btn => {
      const text = btn.textContent?.trim();
      
      if (btn.hasAttribute('aria-label') && btn.getAttribute('aria-label')?.includes('возможности')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          // Find original accessibility button and click it
          const originalBtn = document.querySelector('[aria-label="Специальные возможности"]');
          if (originalBtn) {
            (originalBtn as HTMLElement).click();
          }
        });
      } else if (text?.includes('Админ')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = '/admin';
        });
      } else if (text?.includes('Выход')) {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/";
          } catch (error) {
            window.location.href = "/";
          }
        });
      }
    });

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
        const hasGrayscale = document.documentElement.classList.contains('grayscale');
        console.log('Grayscale mode changed:', hasGrayscale);
        
        if (hasGrayscale && !grayscaleHeader) {
          createGrayscaleHeader();
        } else if (!hasGrayscale && grayscaleHeader) {
          removeGrayscaleHeader();
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Initial check
  if (document.documentElement.classList.contains('grayscale')) {
    createGrayscaleHeader();
  }

  return () => {
    observer.disconnect();
    removeGrayscaleHeader();
  };
}