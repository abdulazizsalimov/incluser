import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, Accessibility } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoImage from "@assets/ChatGPT Image 30 июн. 2025 г., 08_27_22_1751254062366.png";

import AccessibilityWidget from "./AccessibilityWidget";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Главная" },
    { href: "/articles", label: "Статьи" },
    { href: "/about", label: "Об авторе" },
    { href: "/contact", label: "Контакты" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-background shadow-sm border-b border-border fixed top-0 left-0 right-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2 rounded">
              <img 
                src={logoImage} 
                alt="Incluser - доступный сайт о доступности" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav id="navigation" role="navigation" aria-label="Основная навигация" className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-2 py-1 ${
                      isActive(item.href)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Accessibility Widget */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAccessibilityOpen(true)}
              aria-label="Специальные возможности"
              className="hidden sm:flex"
            >
              <Accessibility className="h-4 w-4" />
              <span className="ml-2">Доступность</span>
            </Button>

            {/* Auth Buttons */}
            {!isLoading && (
              <div className="flex items-center space-x-2">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    {user?.isAdmin && (
                      <Link href="/admin">
                        <Button variant="outline" size="sm">
                          Админ-панель
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = "/api/logout"}
                    >
                      Выход
                    </Button>
                  </div>
                ) : (
                  <div className="hidden sm:flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => window.location.href = "/api/login"}
                    >
                      Вход
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = "/api/login"}
                    >
                      Регистрация
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  aria-label="Открыть меню навигации"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAccessibilityOpen(true)}
                      className="w-full justify-start"
                    >
                      <Accessibility className="h-4 w-4 mr-2" />
                      Доступность
                    </Button>
                    
                    {!isLoading && !isAuthenticated && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => window.location.href = "/api/login"}
                          className="w-full"
                        >
                          Вход
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = "/api/login"}
                          className="w-full"
                        >
                          Регистрация
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AccessibilityWidget open={accessibilityOpen} onOpenChange={setAccessibilityOpen} />
    </header>
  );
}
