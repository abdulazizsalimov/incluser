import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState("ru");

  useEffect(() => {
    // Add Google Translate script
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);

    // Initialize Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "ru",
          includedLanguages: "ru,en",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    
    // Trigger Google Translate
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = lang === "ru" ? "" : lang;
      selectElement.dispatchEvent(new Event('change'));
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
