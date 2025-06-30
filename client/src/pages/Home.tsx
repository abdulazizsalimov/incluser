import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLinks from "@/components/SkipLinks";
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
      <SkipLinks />
      <Header />
      
      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 text-white py-16 sm:py-24 overflow-hidden" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[400px]">
              {/* Photo on the left */}
              <div className="relative order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
                  <img 
                    src={heroPhoto} 
                    alt="Автор блога работает за компьютером, демонстрируя использование цифровых технологий"
                    className="w-full h-[300px] sm:h-[400px] object-cover object-center"
                    loading="eager"
                  />
                  {/* Multiple gradient overlays for smooth blending */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/10 to-blue-600/40"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cyan-500/20"></div>
                </div>
                
                {/* Enhanced decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-teal-400/20 to-blue-600/15 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
              </div>
              
              {/* Content on the right */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  Incluser
                  <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-2 opacity-90">
                    доступный сайт о доступности
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl mb-8 opacity-90 leading-relaxed">
                  Личный блог, посвященный цифровой доступности, инклюзивному дизайну и созданию веб-решений, 
                  которыми могут пользоваться все люди, независимо от их способностей.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/articles">
                    <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-100">
                      Читать статьи
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      Об авторе
                    </Button>
                  </Link>
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
