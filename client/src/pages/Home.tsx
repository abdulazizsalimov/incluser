import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetaTags from "@/components/MetaTags";
import AccessibilityFeaturesSlider from "@/components/AccessibilityFeaturesSlider";
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
                    <Button 
                      size="sm" 
                      className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold shadow-lg text-xs px-3"
                      onClick={() => window.location.href = "/articles"}
                    >
                      Читать статьи
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg backdrop-blur-sm bg-white/10 text-xs px-3"
                      onClick={() => window.location.href = "/about"}
                    >
                      Об авторе
                    </Button>
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
                    <Button 
                      size="lg" 
                      className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold shadow-lg"
                      onClick={() => window.location.href = "/articles"}
                    >
                      Читать статьи
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg backdrop-blur-sm bg-white/10"
                      onClick={() => window.location.href = "/about"}
                    >
                      Об авторе
                    </Button>
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
                  <Button 
                    size="lg"
                    onClick={() => window.location.href = "/articles"}
                  >
                    Все статьи
                  </Button>
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

        {/* Accessibility Features Banner with Rotating Slides */}
        <AccessibilityFeaturesSlider />

        {/* Popular Sections Navigation */}
        <section className="bg-muted py-16" aria-labelledby="popular-sections">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 id="popular-sections" className="text-3xl font-bold text-foreground mb-8">
                Популярные разделы
              </h2>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                Быстрый доступ к ключевым материалам по цифровой доступности
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {/* WCAG Guides */}
                <article className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-accent overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-4xl" role="img" aria-label="Книги">📚</div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold mb-3">
                          <Link 
                            href="#" 
                            className="text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded transition-colors"
                          >
                            Руководства WCAG
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Подробные руководства по стандартам веб-доступности и их практическому применению
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </article>

                {/* Testing Tools */}
                <article className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-accent overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-4xl" role="img" aria-label="Пробирка">🧪</div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold mb-3">
                          <Link 
                            href="#" 
                            className="text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded transition-colors"
                          >
                            Инструменты тестирования
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Обзор лучших инструментов для автоматической и ручной проверки доступности
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </article>

                {/* Best Practices */}
                <article className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-accent overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-4xl" role="img" aria-label="Лампочка">💡</div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold mb-3">
                          <Link 
                            href="#" 
                            className="text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded transition-colors"
                          >
                            Лучшие практики
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Проверенные решения и подходы к созданию доступных интерфейсов
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </article>

                {/* Training & Webinars */}
                <article className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-accent overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-4xl" role="img" aria-label="Преподаватель">🧑‍🏫</div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold mb-3">
                          <Link 
                            href="#" 
                            className="text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded transition-colors"
                          >
                            Обучение и вебинары
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Образовательные материалы, курсы и записи вебинаров по цифровой доступности
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </article>

                {/* Screen Readers */}
                <article className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-accent overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-4xl" role="img" aria-label="Компьютер с речью">🗣️</div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold mb-3">
                          <Link 
                            href="#" 
                            className="text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded transition-colors"
                          >
                            Программы экранного доступа
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Обзор популярных скринридеров: NVDA, JAWS, VoiceOver и советы по их использованию
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </article>

                {/* Mobile Apps */}
                <article className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-accent overflow-hidden md:col-span-2 lg:col-span-1">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-4xl" role="img" aria-label="Мобильный телефон">📱</div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold mb-3">
                          <Link 
                            href="#" 
                            className="text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded transition-colors"
                          >
                            Мобильные приложения
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Приложения для мобильных устройств, направленные на обеспечение доступности и инклюзивности
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </article>
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
