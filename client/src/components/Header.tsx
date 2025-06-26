import { Link, useLocation } from "wouter";
import { Menu, X, Settings, Globe } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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

  const navLinkStyle = (path: string) => ({
    color: isActive(path) ? '#0369a1' : '#4b5563',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    transition: 'all 0.2s',
    backgroundColor: isActive(path) ? '#f1f5f9' : 'transparent'
  });

  const mobileNavLinkStyle = (path: string) => ({
    display: 'block',
    color: isActive(path) ? '#0369a1' : '#4b5563',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    backgroundColor: isActive(path) ? '#f1f5f9' : 'transparent'
  });

  return (
    <header 
      style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(8px)', 
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }} 
      role="banner"
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#0369a1',
                display: 'flex',
                alignItems: 'center'
              }}>
                Incluser
              </span>
            </Link>
          </div>

          {/* Navigation Links - Always visible on desktop */}
          <nav 
            role="navigation" 
            aria-label="Основная навигация"
            style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}
          >
            <Link href="/" style={navLinkStyle("/")}>
              Главная
            </Link>
            <Link href="/articles" style={navLinkStyle("/articles")}>
              Статьи
            </Link>
            <Link href="/about" style={navLinkStyle("/about")}>
              Об авторе
            </Link>
            <Link href="/contact" style={navLinkStyle("/contact")}>
              Контакты
            </Link>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Google Translate */}
            <GoogleTranslate />
            
            {/* Accessibility Widget Button */}
            <button
              onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
              style={{
                background: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#6b7280'
              }}
              aria-label="Настройки доступности"
            >
              <Settings size={18} />
            </button>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Привет, {(user as any)?.firstName || 'Пользователь'}!
                </span>
                <a 
                  href="/api/logout"
                  style={{
                    background: '#0369a1',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Выйти
                </a>
              </div>
            ) : (
              <a 
                href="/api/login"
                style={{
                  background: '#0369a1',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Войти
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Accessibility Widget */}
      <AccessibilityWidget open={isAccessibilityOpen} onOpenChange={setIsAccessibilityOpen} />
    </header>
  );
}