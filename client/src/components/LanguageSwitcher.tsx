import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGoogleTranslate } from "@/hooks/useGoogleTranslate";

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, resetToRussian, isTranslating } = useGoogleTranslate();

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ] as const;

  const handleLanguageChange = (langCode: 'ru' | 'en') => {
    if (langCode === 'ru') {
      resetToRussian();
    } else {
      changeLanguage(langCode);
    }
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <>
      {/* Language Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            aria-label="Выбрать язык"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">
              {currentLang?.flag} {currentLang?.name}
            </span>
            <span className="sm:hidden">
              {currentLang?.flag}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[150px]">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center gap-2 cursor-pointer ${
                currentLanguage === language.code ? 'bg-accent' : ''
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
              {currentLanguage === language.code && (
                <span className="ml-auto text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Translation Status Indicator */}
      {isTranslating && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm shadow-lg z-50">
          Переводится на английский...
        </div>
      )}
    </>
  );
}