// Fix for header disappearing in grayscale mode
export function initGrayscaleHeaderFix() {
  let clonedHeader: HTMLElement | null = null;

  const createClone = () => {
    const header = document.querySelector('header[role="banner"]') as HTMLElement;
    if (!header || clonedHeader) return;

    clonedHeader = header.cloneNode(true) as HTMLElement;
    clonedHeader.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      z-index: 99999 !important;
      filter: none !important;
      background: white !important;
      border-bottom: 1px solid #e5e7eb !important;
    `;

    document.documentElement.appendChild(clonedHeader);
    header.style.display = 'none';

    // Fix buttons
    clonedHeader.querySelectorAll('button').forEach(btn => {
      const text = btn.textContent?.trim();
      if (text?.includes('Админ')) {
        btn.onclick = () => window.location.href = '/admin';
      } else if (text?.includes('Выход')) {
        btn.onclick = async () => {
          await fetch('/api/logout', { method: 'POST' });
          window.location.href = '/';
        };
      } else if (btn.getAttribute('aria-label')?.includes('возможности')) {
        btn.onclick = () => {
          const orig = document.querySelector('[aria-label="Специальные возможности"]') as HTMLElement;
          orig?.click();
        };
      }
    });

    // Fix links
    clonedHeader.querySelectorAll('a').forEach(link => {
      link.onclick = (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) window.location.href = href;
      };
    });
  };

  const removeClone = () => {
    if (clonedHeader) {
      clonedHeader.remove();
      clonedHeader = null;
    }
    const header = document.querySelector('header[role="banner"]') as HTMLElement;
    if (header) header.style.display = '';
  };

  new MutationObserver(() => {
    const isGrayscale = document.documentElement.classList.contains('grayscale');
    if (isGrayscale && !clonedHeader) createClone();
    else if (!isGrayscale && clonedHeader) removeClone();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  if (document.documentElement.classList.contains('grayscale')) createClone();
}