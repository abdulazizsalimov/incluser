import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

type Language = 'ru' | 'en';

export function useGoogleTranslate() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ru');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Google Translate script
  useEffect(() => {
    if (window.google?.translate) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'ru',
        includedLanguages: 'ru,en',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
      }, 'google_translate_element');
      
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  const changeLanguage = useCallback((targetLang: Language) => {
    if (!isLoaded) return;

    setCurrentLanguage(targetLang);

    // Wait a bit for Google Translate to be fully loaded
    setTimeout(() => {
      // Try to find the Google Translate select element
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        // Set the value to target language
        select.value = targetLang;
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        select.dispatchEvent(event);
      } else {
        // Fallback: trigger translation programmatically
        if (window.google?.translate?.TranslateElement) {
          // Create a temporary visible select to trigger translation
          const tempElement = document.createElement('div');
          tempElement.id = 'temp_translate_element';
          tempElement.style.position = 'absolute';
          tempElement.style.left = '-9999px';
          document.body.appendChild(tempElement);
          
          new window.google.translate.TranslateElement({
            pageLanguage: 'ru',
            includedLanguages: 'ru,en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          }, 'temp_translate_element');
          
          // Find the select in temp element and trigger it
          setTimeout(() => {
            const tempSelect = tempElement.querySelector('select') as HTMLSelectElement;
            if (tempSelect) {
              tempSelect.value = targetLang;
              tempSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
            // Clean up temp element
            setTimeout(() => {
              if (document.body.contains(tempElement)) {
                document.body.removeChild(tempElement);
              }
            }, 1000);
          }, 100);
        }
      }
    }, 100);
  }, [isLoaded]);

  const resetToRussian = useCallback(() => {
    // Force page reload to reset to original Russian
    if (currentLanguage !== 'ru') {
      const url = new URL(window.location.href);
      url.hash = '';
      window.location.href = url.toString();
    }
  }, [currentLanguage]);

  return {
    currentLanguage,
    isLoaded,
    changeLanguage,
    resetToRussian,
    isTranslating: currentLanguage === 'en'
  };
}