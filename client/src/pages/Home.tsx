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
        image="/og-image.jpg"
        url="/"
        type="website"
        siteName="Incluser"
      />
      
      <SkipLinks />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden text-white" aria-labelledby="hero-heading">
          <div className="absolute inset-0">
            {/* Mobile: Just gradient background */}
            <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500"></div>
            
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
              
              {/* Blue background for areas not covered by photo */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 -z-10"></div>
              
              {/* Gradient overlays on top of photo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-600/90"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent from-30% via-blue-600/40 via-60% to-blue-600"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-600/20 to-teal-500/40"></div>
            </div>

            {/* Mobile: Identical to desktop - Photo with gradient overlay */}
            <div className="lg:hidden absolute inset-0">
              {/* Photo without cropping */}
              <div className="absolute inset-0">
                <img 
                  src={heroPhoto} 
                  alt="Автор блога работает за компьютером, демонстрируя использование цифровых технологий"
                  className="w-full h-full object-contain object-left"
                  loading="eager"
                />
              </div>
              
              {/* Blue background for areas not covered by photo */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 -z-10"></div>
              
              {/* Gradient overlays on top of photo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-600/90"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent from-30% via-blue-600/40 via-60% to-blue-600"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-600/20 to-teal-500/40"></div>
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 min-h-screen flex items-center">
            <div className="w-full flex justify-end pr-4 sm:pr-6 lg:pr-8">
              <div className="text-center lg:text-left text-white max-w-md lg:max-w-lg xl:max-w-xl">
                <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  Incluser
                  <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-2 opacity-90">
                    доступный сайт о доступности
                  </span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-90 leading-relaxed">
                  Личный блог, посвященный цифровой доступности, инклюзивному дизайну и созданию веб-решений, 
                  которыми могут пользоваться все люди, независимо от их способностей.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : articlesData?.articles?.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articlesData.articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Пока нет опубликованных статей. Загляните позже!
                </p>
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link href="/articles">
                <Button size="lg" variant="outline">
                  Все статьи
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}