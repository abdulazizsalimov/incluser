import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState("ru");

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    try {
      // Add Google Translate script with error handling
      script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      
      script.onerror = () => {
        console.warn('Google Translate script failed to load');
      };

      // Initialize Google Translate with error handling
      (window as any).googleTranslateElementInit = () => {
        try {
          if (window && (window as any).google && (window as any).google.translate) {
            new (window as any).google.translate.TranslateElement(
              {
                pageLanguage: "ru",
                includedLanguages: "ru,en",
                layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              "google_translate_element"
            );
          }
        } catch (error) {
          console.warn('Google Translate initialization failed:', error);
        }
      };

      document.head.appendChild(script);
    } catch (error) {
      console.warn('Failed to add Google Translate script:', error);
    }

    return () => {
      try {
        const existingScript = document.querySelector('script[src*="translate.google.com"]');
        if (existingScript) {
          existingScript.remove();
        }
        // Clean up global function
        if ((window as any).googleTranslateElementInit) {
          delete (window as any).googleTranslateElementInit;
        }
      } catch (error) {
        console.warn('Error cleaning up Google Translate:', error);
      }
    };
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    
    try {
      // Trigger Google Translate
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = lang === "ru" ? "" : lang;
        selectElement.dispatchEvent(new Event('change'));
      }
    } catch (error) {
      console.warn('Error changing language:', error);
    }
  };

  return (
    <div className="relative">
      <div id="google_translate_element" className="hidden"></div>
      <Select value={currentLang} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-24 h-9">
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ru">🇷🇺 RU</SelectItem>
          <SelectItem value="en">🇺🇸 EN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
