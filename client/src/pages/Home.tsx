import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, User, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLinks from "@/components/SkipLinks";
import type { ArticleWithRelations } from "@shared/schema";

export default function Home() {
  const { data: articlesData, isLoading } = useQuery<{ articles: ArticleWithRelations[]; total: number }>({
    queryKey: ["/api/articles"],
    queryFn: async () => {
      const response = await fetch("/api/articles?limit=3");
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    },
  });

  const articles = articlesData?.articles || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SkipLinks />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="hero-gradient py-16 text-white" role="banner" aria-labelledby="hero-title">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold">
                Incluser
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-2 opacity-90">
                доступный сайт о доступности
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Личный блог, посвященный цифровой доступности, инклюзивному дизайну и созданию веб-решений, 
              которыми могут пользоваться все люди, независимо от их способностей.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <article key={article.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-card-foreground mb-3">
                      <Link 
                        href={`/articles/${article.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    {article.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{article.author?.firstName || 'Автор'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{new Date(article.createdAt || '').toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Статьи пока не опубликованы. Скоро здесь появится интересный контент!
                </p>
              </div>
            )}

            {articles.length > 0 && (
              <div className="text-center mt-12">
                <Link href="/articles">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Все статьи
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}