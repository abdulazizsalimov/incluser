import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLinks from "@/components/SkipLinks";
import MetaTags from "@/components/MetaTags";
import heroPhoto from "@/assets/hero-photo.png";
import type { ArticleWithRelations } from "@shared/schema";

export default function Home() {
  const { data: articlesData, isLoading } = useQuery<{
    articles: ArticleWithRelations[];
    totalCount: number;
  }>({
    queryKey: ["/api/articles", { limit: 5, published: true }],
    queryFn: async () => {
      const response = await fetch("/api/articles?limit=5&published=true");
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Incluser - доступный сайт о доступности"
        description="Личный блог, посвященный цифровой доступности, инклюзивному дизайну и созданию веб-решений, которыми могут пользоваться все люди, независимо от их способностей."
        image={`${window.location.origin}${heroPhoto}`}
        url={window.location.href}
      />
      <SkipLinks />
      <Header />
      
      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="relative text-white overflow-hidden lg:min-h-[600px]" aria-labelledby="hero-heading">
          {/* Desktop: Photo with gradient overlay */}
          <div className="hidden lg:block absolute inset-0">
            {/* Photo without cropping */}
            <div className="absolute inset-0">
              <img 
                src={heroPhoto} 
                alt="Автор блога работает за компьютером, демонстрируя использование цифровых технологий"
                className="w-full h-full object-contain object-left"
                loading="eager"
              />
            </div>
            
            {/* Adaptive background for areas not covered by photo */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 -z-10"></div>
            
            {/* Adaptive gradient overlays on top of photo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent from-10% via-blue-600/10 via-25% via-blue-600/30 via-50% to-blue-600 dark:via-purple-600/10 dark:via-purple-600/30 dark:to-purple-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent from-15% via-blue-600/20 via-35% via-blue-600/60 via-65% to-blue-600 dark:via-purple-600/20 dark:via-purple-600/60 dark:to-purple-700"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent from-20% via-cyan-600/20 via-45% via-teal-500/40 via-70% to-teal-500/80 dark:via-blue-600/20 dark:via-indigo-500/40 dark:to-purple-500/80"></div>
          </div>

          {/* Mobile: Photo with overlay and content - natural height */}
          <div className="lg:hidden relative">
            {/* Photo without cropping - natural height */}
            <div className="relative">
              <img 
                src={heroPhoto} 
                alt="Автор блога работает за компьютером, демонстрируя использование цифровых технологий"
                className="w-full h-auto object-contain"
                loading="eager"
              />
              
              {/* Adaptive gradient overlays on top of photo for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent from-10% via-blue-600/10 via-25% via-blue-600/30 via-50% to-blue-600 dark:via-purple-600/10 dark:via-purple-600/30 dark:to-purple-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent from-15% via-blue-600/20 via-35% via-blue-600/60 via-65% to-blue-600 dark:via-purple-600/20 dark:via-purple-600/60 dark:to-purple-700"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent from-20% via-cyan-600/20 via-45% via-teal-500/40 via-70% to-teal-500/80 dark:via-blue-600/20 dark:via-indigo-500/40 dark:to-purple-500/80"></div>
              
              {/* Content overlay - centered vertically with compact layout */}
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="text-center text-white max-w-sm">
                  <h1 id="hero-heading" className="text-3xl sm:text-4xl font-bold mb-3">
                    Incluser
                  </h1>
                  <h2 className="text-lg sm:text-xl font-medium mb-4 opacity-90">
                    доступный сайт о доступности
                  </h2>
                  <p className="text-base sm:text-lg mb-5 opacity-90 leading-relaxed">
                    Личный блог, посвященный цифровой доступности, инклюзивному дизайну и созданию веб-решений, 
                    которыми могут пользоваться все люди, независимо от их способностей.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Link href="/articles">
                      <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold shadow-lg text-xs px-3">
                        Читать статьи
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button size="sm" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg backdrop-blur-sm bg-white/10 text-xs px-3">
                        Об авторе
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Content */}
          <div className="hidden lg:block relative z-10 h-full">
            <div className="w-full h-full flex items-center">
              {/* Text positioned to follow the right edge of the photo */}
              <div className="w-full flex justify-end pr-4 sm:pr-6 lg:pr-8">
                <div className="text-left text-white max-w-lg xl:max-w-xl mt-20">
                  <h1 id="hero-heading-desktop" className="text-6xl font-bold mb-6">
                    Incluser
                    <span className="block text-4xl font-medium mt-2 opacity-90">
                      доступный сайт о доступности
                    </span>
                  </h1>
                  <p className="text-xl mb-8 opacity-90 leading-relaxed">
                    Личный блог, посвященный цифровой доступности, инклюзивному дизайну и созданию веб-решений, 
                    которыми могут пользоваться все люди, независимо от их способностей.
                  </p>
                  <div className="flex gap-4">
                    <Link href="/articles">
                      <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold shadow-lg">
                        Читать статьи
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg backdrop-blur-sm bg-white/10">
                        Об авторе
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Articles Section */}
        <section className="py-16" aria-labelledby="latest-articles">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="latest-articles" className="text-3xl font-bold text-foreground mb-4">
                Свежие статьи
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Последние публикации о цифровой доступности, лучших практиках и новых решениях
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            ) : articlesData?.articles.length ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articlesData.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link href="/articles">
                    <Button size="lg">
                      Все статьи
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Пока что статей нет. Следите за обновлениями!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Accessibility Features Banner */}
        <section className="relative text-white overflow-hidden py-16" aria-labelledby="accessibility-features">
          {/* Background with same gradient as hero */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900"></div>
          
          {/* Accessibility symbols pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-8 transform rotate-12 scale-110">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="flex items-center justify-center text-6xl text-white/20">
                  {i % 4 === 0 && "♿"}
                  {i % 4 === 1 && "👁"}
                  {i % 4 === 2 && "🔊"}
                  {i % 4 === 3 && "⌨"}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="accessibility-features" className="text-4xl font-bold mb-6">
                Специальные возможности
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                Наш сайт включает множество инструментов доступности, чтобы каждый мог комфортно читать и взаимодействовать с контентом
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Font Adjustments */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 4v3h5.5v12h3V7H19V4z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Настройка шрифтов</h3>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  Изменение размера шрифта, междустрочного и межбуквенного интервала для лучшей читаемости
                </p>
                <div className="text-xs opacity-75">
                  75-150% размер • Интервалы до 200%
                </div>
              </div>

              {/* Text-to-Speech */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Озвучивание текста</h3>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  Функция чтения выделенного текста вслух с настройкой скорости и выбором голоса
                </p>
                <div className="text-xs opacity-75">
                  Браузерный синтез • RHVoice поддержка
                </div>
              </div>

              {/* Visual Enhancements */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Визуальные улучшения</h3>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  Черно-белый режим, увеличение текста при наведении, высокий контраст
                </p>
                <div className="text-xs opacity-75">
                  Shift + наведение • Цветовые схемы
                </div>
              </div>

              {/* Theme Control */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.5 2C5.71 3.15 4.5 5.18 4.5 7.5c0 1.77.78 3.34 2 4.44V20h11v-8.06c1.22-1.1 2-2.67 2-4.44 0-2.32-1.21-4.35-3-5.5L12 9 7.5 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Темы оформления</h3>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  Светлая и темная темы с космическими градиентами, автоматическое переключение
                </p>
                <div className="text-xs opacity-75">
                  Светлая • Темная • Системная
                </div>
              </div>

              {/* Motion Control */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Управление движением</h3>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  Отключение анимаций и переходов для пользователей с вестибулярными нарушениями
                </p>
                <div className="text-xs opacity-75">
                  Уменьшить анимации • Статичный интерфейс
                </div>
              </div>

              {/* Keyboard Navigation */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Навигация с клавиатуры</h3>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  Полная поддержка навигации с клавиатуры, Skip Links, правильный порядок фокуса
                </p>
                <div className="text-xs opacity-75">
                  Tab навигация • Skip Links • Escape
                </div>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => {
                  // Find accessibility button in header and click it
                  const accessibilityButton = document.querySelector('[aria-label="Специальные возможности"]') as HTMLButtonElement;
                  if (accessibilityButton) {
                    accessibilityButton.click();
                  }
                }}
                className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
                aria-describedby="try-accessibility-desc"
              >
                Попробовать
              </button>
              <p id="try-accessibility-desc" className="text-sm opacity-75 mt-3">
                Откроет панель специальных возможностей для настройки сайта
              </p>
            </div>
          </div>
        </section>

        {/* Digital Accessibility Info Section */}
        <section className="bg-muted py-16" aria-labelledby="accessibility-info">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 id="accessibility-info" className="text-3xl font-bold text-foreground mb-8">
                Что такое цифровая доступность?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="bg-card p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Для всех пользователей</h3>
                  <p className="text-muted-foreground">
                    Доступность означает, что веб-сайты и приложения могут использовать люди 
                    с различными способностями и ограничениями.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Стандарты WCAG</h3>
                  <p className="text-muted-foreground">
                    Следование международным стандартам WCAG обеспечивает 
                    высокое качество и доступность цифровых продуктов.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.006 2.006 0 0 0 18.06 7c-.8 0-1.54.5-1.85 1.26l-1.92 5.75c-.16.48-.21 1.03-.12 1.58L15.49 19H12l-.53-4H9.41l.59 4.5c.1.75.69 1.33 1.45 1.5H20v-1h-1.5l.5-4z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Социальная ответственность</h3>
                  <p className="text-muted-foreground">
                    Создание инклюзивных решений — это вопрос социальной ответственности 
                    и равных возможностей в цифровом мире.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Live region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="status-messages"></div>
    </div>
  );
}
