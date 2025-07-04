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
        autoDisplay: false
      }, 'google_translate_element');
      
      // Wait for element to be created
      setTimeout(() => {
        setIsLoaded(true);
      }, 500);
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
    if (!isLoaded) {
      console.log('Google Translate not loaded yet');
      return;
    }

    console.log(`Changing language to: ${targetLang}`);
    setCurrentLanguage(targetLang);

    // Wait for Google Translate to be ready
    setTimeout(() => {
      // Try to find the existing select
      let select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      console.log('Found select element:', !!select);
      
      if (select) {
        console.log('Select options:', Array.from(select.options).map(o => ({ value: o.value, text: o.text })));
        
        // Set language and trigger change
        select.value = targetLang;
        console.log('Set select value to:', targetLang);
        
        // Trigger change event with multiple methods
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Also try click event
        if (select.onchange) {
          select.onchange(new Event('change') as any);
        }
      } else {
        console.log('Select not found, checking Google Translate element');
        const gtElement = document.getElementById('google_translate_element');
        console.log('Google Translate element found:', !!gtElement);
        
        if (gtElement) {
          console.log('Element content:', gtElement.innerHTML);
        }
      }
    }, 500); // Increased timeout
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