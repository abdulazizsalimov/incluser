import { Link, useLocation } from "wouter";
import { Menu, X, Settings, Globe } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import AccessibilityWidget from "./AccessibilityWidget";
import GoogleTranslate from "./GoogleTranslate";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-border" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-2xl font-bold text-primary flex items-center">
                Incluser
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav role="navigation" aria-label="Основная навигация" className="hidden md:flex">
            <div className="flex space-x-6">
              <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/") 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}>
                Главная
              </Link>
              <Link href="/articles" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/articles") 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}>
                Статьи
              </Link>
              <Link href="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/about") 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}>
                Об авторе
              </Link>
              <Link href="/contact" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/contact") 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}>
                Контакты
              </Link>
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Google Translate */}
            <GoogleTranslate />
            
            {/* Accessibility Widget Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
              aria-label="Настройки доступности"
            >
              <Settings size={16} />
            </Button>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Привет, {(user as any)?.firstName || 'Пользователь'}!
                </span>
                <Button asChild size="sm">
                  <a href="/api/logout">Выйти</a>
                </Button>
              </div>
            ) : (
              <Button asChild size="sm">
                <a href="/api/login">Войти</a>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Открыть меню навигации"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-4">
            <nav role="navigation" aria-label="Мобильная навигация">
              <div className="flex flex-col space-y-1">
                <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/") 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`} onClick={() => setIsMenuOpen(false)}>
                  Главная
                </Link>
                <Link href="/articles" className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/articles") 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`} onClick={() => setIsMenuOpen(false)}>
                  Статьи
                </Link>
                <Link href="/about" className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/about") 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`} onClick={() => setIsMenuOpen(false)}>
                  Об авторе
                </Link>
                <Link href="/contact" className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/contact") 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`} onClick={() => setIsMenuOpen(false)}>
                  Контакты
                </Link>
              </div>
            </nav>

            {/* Mobile Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <GoogleTranslate />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                  aria-label="Настройки доступности"
                >
                  <Settings size={16} />
                </Button>
              </div>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Привет, {(user as any)?.firstName || 'Пользователь'}!
                  </p>
                  <Button asChild className="w-full">
                    <a href="/api/logout">Выйти</a>
                  </Button>
                </div>
              ) : (
                <Button asChild className="w-full">
                  <a href="/api/login">Войти</a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Widget */}
      <AccessibilityWidget open={isAccessibilityOpen} onOpenChange={setIsAccessibilityOpen} />
    </header>
  );
}