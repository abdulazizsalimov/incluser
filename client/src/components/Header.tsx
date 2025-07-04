import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Accessibility, ChevronDown, LogIn, UserPlus, LogOut, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoImage from "@assets/ChatGPT Image 30 июн. 2025 г., 08_27_22_1751254062366.png";
import type { Category } from "@shared/schema";

import AccessibilityWidget from "./AccessibilityWidget";
import SkipLinks from "./SkipLinks";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

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

  const headerContent = (
    <header 
      className="bg-background shadow-sm border-b border-border fixed top-0 left-0 right-0 z-50" 
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        filter: 'none',
        isolation: 'isolate',
        pointerEvents: 'auto'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2 rounded">
              <img 
                src={logoImage} 
                alt="Incluser - доступный сайт о доступности" 
                className="h-24 w-auto max-w-none"
              />
            </Link>
          </div>

          {/* Skip Links after logo */}
          <SkipLinks />

          {/* Desktop Navigation */}
          <nav id="navigation" role="navigation" aria-label="Основная навигация" className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.href} className="flex items-center">
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
                  
                  {/* Categories dropdown for Articles */}
                  {item.href === "/articles" && categories.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-6 w-6 p-0"
                          aria-label="Категории статей"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-[200px]">
                        <DropdownMenuItem asChild>
                          <Link href="/articles" className="w-full cursor-pointer">
                            Все статьи
                          </Link>
                        </DropdownMenuItem>
                        {categories.map((category) => (
                          <DropdownMenuItem key={category.id} asChild>
                            <Link 
                              href={`/articles?category=${category.slug}`} 
                              className="w-full cursor-pointer"
                            >
                              {category.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = "/admin"}
                      >
                        Админ-панель
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await fetch("/api/logout", { method: "POST" });
                          window.location.href = "/";
                        } catch (error) {
                          window.location.href = "/";
                        }
                      }}
                    >
                      Выход
                    </Button>
                  </div>
                ) : (
                  <div className="hidden sm:flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => window.location.href = "/login"}
                    >
                      Вход
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
              <SheetContent side="right" className="w-[280px] flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="flex flex-col space-y-3 mt-4">
                    {navItems.map((item) => (
                      <div key={item.href}>
                        <Link 
                          href={item.href}
                          className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-primary hover:bg-muted"
                          }`}
                        >
                          {item.label}
                        </Link>
                        
                        {/* Categories submenu for Articles in mobile */}
                        {item.href === "/articles" && categories.length > 0 && (
                          <div className="ml-4 mt-2 space-y-1">
                            <div className="text-sm font-medium text-muted-foreground px-3 py-1">
                              Категории:
                            </div>
                            <Link 
                              href="/articles"
                              className="block px-3 py-1 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded"
                            >
                              Все статьи
                            </Link>
                            {categories.map((category) => (
                              <Link 
                                key={category.id}
                                href={`/articles?category=${category.slug}`}
                                className="block px-3 py-1 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded"
                              >
                                {category.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
                
                {/* Fixed bottom section */}
                <div className="border-t bg-background p-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAccessibilityOpen(true)}
                    className="w-full justify-center xs:justify-start"
                    title="Доступность"
                  >
                    <Accessibility className="h-4 w-4" />
                    <span className="hidden xs:inline xs:ml-2">Доступность</span>
                  </Button>
                  
                  {!isLoading && (
                    <>
                      {isAuthenticated ? (
                        <div className="space-y-2">
                          {user?.isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.href = "/admin"}
                              className="w-full justify-center xs:justify-start"
                              title="Админ-панель"
                            >
                              <Settings className="h-4 w-4" />
                              <span className="hidden xs:inline xs:ml-2">Админ-панель</span>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                await fetch("/api/logout", { method: "POST" });
                                window.location.href = "/";
                              } catch (error) {
                                window.location.href = "/";
                              }
                            }}
                            className="w-full justify-center xs:justify-start"
                            title="Выход"
                          >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden xs:inline xs:ml-2">Выход</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => window.location.href = "/login"}
                          className="w-full justify-center xs:justify-start"
                          title="Вход"
                        >
                          <LogIn className="h-4 w-4" />
                          <span className="hidden xs:inline xs:ml-2">Вход</span>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AccessibilityWidget open={accessibilityOpen} onOpenChange={setAccessibilityOpen} />
    </header>
  );

  // Create isolated container for header outside of all CSS contexts
  useEffect(() => {
    let headerContainer = document.getElementById('header-container');
    if (!headerContainer) {
      headerContainer = document.createElement('div');
      headerContainer.id = 'header-container';
      headerContainer.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 80px !important;
        pointer-events: none !important;
        z-index: 50 !important;
        filter: none !important;
        isolation: isolate !important;
      `;
      document.documentElement.appendChild(headerContainer);
    }
    return () => {
      const container = document.getElementById('header-container');
      if (container && !document.querySelector('header')) {
        container.remove();
      }
    };
  }, []);

  // Render header in isolated container
  const headerContainer = document.getElementById('header-container');
  return headerContainer ? createPortal(headerContent, headerContainer) : null;
}
