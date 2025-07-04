import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

type Language = 'ru' | 'en';

export function useGoogleTranslate() {
  // Detect current language based on URL
  const isOnTranslatePage = window.location.href.includes('translate.google.com');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(isOnTranslatePage ? 'en' : 'ru');
  const [isLoaded, setIsLoaded] = useState(false);

  // Simple loading effect
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const changeLanguage = useCallback((targetLang: Language) => {
    if (!isLoaded) {
      console.log('Google Translate not loaded yet');
      return;
    }

    console.log(`Changing language to: ${targetLang}`);
    setCurrentLanguage(targetLang);

    if (targetLang === 'en') {
      // Trigger translation to English using Google Translate URL approach
      const currentUrl = window.location.href;
      const translatedUrl = `https://translate.google.com/translate?sl=ru&tl=en&u=${encodeURIComponent(currentUrl)}`;
      
      console.log('Redirecting to Google Translate URL:', translatedUrl);
      window.location.href = translatedUrl;
    } else {
      // Reset to original Russian version by checking if we're on a translate.google.com URL
      const currentUrl = window.location.href;
      if (currentUrl.includes('translate.google.com')) {
        // Extract original URL from Google Translate URL
        const urlMatch = currentUrl.match(/u=([^&]+)/);
        if (urlMatch) {
          const originalUrl = decodeURIComponent(urlMatch[1]);
          console.log('Returning to original URL:', originalUrl);
          window.location.href = originalUrl;
        } else {
          // Fallback: go to home page
          window.location.href = window.location.origin;
        }
      }
    }
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